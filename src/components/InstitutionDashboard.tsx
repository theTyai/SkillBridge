import React, { useState } from 'react';
import {
  InstitutionAnalytics,
  CanonicalSkill,
  User,
  StudentCertification
} from '../types';
import {
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Filter,
  Layers,
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { showToast } from './Toast';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

interface InstitutionDashboardProps {
  analytics: InstitutionAnalytics;
  canonicalSkills: CanonicalSkill[];
  currentUser: User;
  onAddSkill?: (skill: CanonicalSkill) => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({
  analytics,
  canonicalSkills,
  currentUser,
  onAddSkill
}) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'analytics' | 'verification' | 'taxonomy'>('analytics');
  const [searchTaxonomy, setSearchTaxonomy] = useState('');
  const [verifiedLog, setVerifiedLog] = useState<{ id: string; title: string; status: string; verifier: string; time: string }[]>([]);

  // Fetch Institution Students (which includes unverified skills)
  const { data: studentsRes, isLoading } = useQuery<any[]>({
    queryKey: ['institution', 'students'],
    queryFn: async () => {
      const res = await api.get('/institutions/students');
      return res.data.data;
    }
  });

  const students = studentsRes || [];
  
  // Flatten students' unverified skills into a "pendingVerifications" list
  const pendingSkills = React.useMemo<{ id: string; title: string; issuer: string; issueDate: string; credentialId: string; credentialUrl: string; studentName: string; studentId: string }[]>(() => {
    return students.flatMap((s: any) => 
      s.skills.map((sk: any) => ({
        id: sk.id,
        title: sk.canonicalSkill?.name || 'Unknown Skill',
        issuer: 'Self-Reported / Assessment',
        issueDate: sk.createdAt || new Date().toISOString(),
        credentialId: sk.id,
        credentialUrl: '#',
        studentName: s.user?.name,
        studentId: s.id
      }))
    );
  }, [students]);

  const verifyMutation = useMutation({
    mutationFn: async ({ skillId, verified }: { skillId: string; verified: boolean }) => {
      const res = await api.post('/institutions/verify-skill', { skillId, verified, note: 'Admin verified' });
      return res.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['institution', 'students'] });
      
      const skillName = pendingSkills.find(s => s.id === variables.skillId)?.title || 'Skill';
      
      setVerifiedLog(prev => [{
        id: variables.skillId,
        title: skillName,
        status: variables.verified ? 'Approved' : 'Rejected',
        verifier: currentUser.profile?.name || 'Admin',
        time: 'Just now'
      }, ...prev].slice(0, 5));

      showToast(`Skill ${variables.verified ? 'approved' : 'rejected'} successfully`, 'success');
    },
    onError: () => {
      showToast('Failed to verify skill', 'error');
    }
  });

  // Add new skill modal state
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  useEscapeKey(() => setShowAddSkillModal(false), showAddSkillModal);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<CanonicalSkill['category']>('Cloud & DevOps');
  const [newSkillAliases, setNewSkillAliases] = useState('');

  const handleVerifyCredential = (certId: string, approved: boolean) => {
    verifyMutation.mutate({ skillId: certId, verified: approved });
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const skill: CanonicalSkill = {
      id: `sk-${Date.now()}`,
      name: newSkillName,
      slug: newSkillName.toLowerCase().replace(/\s+/g, '-'),
      category: newSkillCategory,
      aliases: newSkillAliases.split(',').map(a => a.trim()).filter(Boolean),
      description: `Canonical skill standard for ${newSkillName}`
    };

    if (onAddSkill) {
      onAddSkill(skill);
    }
    setShowAddSkillModal(false);
    setNewSkillName('');
    setNewSkillAliases('');
    showToast(`Canonical skill "${newSkillName}" created in platform taxonomy.`, 'success');
  };

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value\n" +
      `Total Students,${analytics.totalStudents}\n` +
      `Verified Students,${analytics.verifiedStudents}\n` +
      `Total Faculty,${analytics.totalFaculty}\n` +
      `Partner Companies,${analytics.partnerCompanies}\n` +
      `Active Opportunities,${analytics.activeOpportunities}\n` +
      `Total Applications,${analytics.totalApplications}\n` +
      `Active Internships,${analytics.activeInternships}\n` +
      `Placements Count,${analytics.placementsCount}\n` +
      `Placement Rate,${analytics.placementRate}%\n` +
      `Average Stipend,${analytics.averageStipend}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Apex_Institute_Placement_Report_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSkills = React.useMemo(() => canonicalSkills.filter(sk =>
    sk.name.toLowerCase().includes(searchTaxonomy.toLowerCase()) ||
    sk.category.toLowerCase().includes(searchTaxonomy.toLowerCase()) ||
    sk.aliases.some(a => a.toLowerCase().includes(searchTaxonomy.toLowerCase()))
  ), [canonicalSkills, searchTaxonomy]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white">
              Apex Institute of Technology — Career & Placement Cell
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold">
              Institutional Admin
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Auditing 4,820 students across 3 departments • Governing corporate partnerships and verification integrity
          </p>
        </div>

        <button
          id="btn-export-placement-report"
          onClick={handleExportReport}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Readiness & Placement Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'verification' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Queue ({pendingSkills.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('taxonomy')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
            activeTab === 'taxonomy'
              ? 'bg-indigo-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Curriculum Taxonomy</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Total Enrolled Students</div>
              <div className="text-2xl font-black text-slate-900 mt-1 font-display">{analytics.totalStudents.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {analytics.verifiedStudents.toLocaleString()} Verified ({Math.round((analytics.verifiedStudents / analytics.totalStudents) * 100)}%)
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Placement Rate</div>
              <div className="text-2xl font-black text-indigo-600 mt-1 font-display">{analytics.placementRate}%</div>
              <div className="text-[11px] text-slate-500 mt-1">{analytics.placementsCount} Graduating Offers</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Active Internships</div>
              <div className="text-2xl font-black text-sky-600 mt-1 font-display">{analytics.activeInternships}</div>
              <div className="text-[11px] text-slate-500 mt-1">Avg Stipend: {analytics.averageStipend}</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Corporate Industry Partners</div>
              <div className="text-2xl font-black text-emerald-600 mt-1 font-display">{analytics.partnerCompanies}</div>
              <div className="text-[11px] text-slate-500 mt-1">{analytics.activeOpportunities} Active Campus Drives</div>
            </div>
          </div>

          {/* Top Skill Gaps vs Industry Demand */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Top Skill Gaps Identified (Demand vs Student Supply)
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                Skills highly demanded by recruiters where student body verified coverage is lagging:
              </p>

              <div className="space-y-3">
                {analytics.topSkillGaps.map(gap => (
                  <div key={gap.skill} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{gap.skill}</span>
                      <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold">
                        {gap.gapScore}% Deficit
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Industry Demand: <strong>{gap.demandPercent}%</strong></span>
                      <span>Student Readiness: <strong>{gap.studentCoveragePercent}%</strong></span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-emerald-500 h-2" style={{ width: `${gap.studentCoveragePercent}%` }} title="Student Supply"></div>
                      <div className="bg-amber-400 h-2" style={{ width: `${gap.gapScore}%` }} title="Missing Gap"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                Departmental Performance & Readiness
              </h4>
              <p className="text-xs text-slate-500">
                Average capability index and placements tracked per academic branch:
              </p>

              <div className="space-y-3">
                {analytics.departmentBreakdown.map(dept => (
                  <div key={dept.department} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{dept.department}</span>
                      <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {dept.avgReadiness}% Readiness
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>{dept.studentsCount} Students</span>
                      <span><strong>{dept.placedCount}</strong> Placed ({Math.round((dept.placedCount / (dept.studentsCount * 0.25)) * 100)}% of Seniors)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Verifiable Credential Approval Desk
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Audit student external certifications, hackathon certificates, and degree credentials before issuing a tamper-proof verification seal.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingSkills.map(cert => (
              <div
                key={cert.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 mt-0.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{cert.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Issuer: <strong>{cert.issuer}</strong> • Issue Date: {cert.issueDate}
                    </p>
                    <p className="text-xs font-mono text-indigo-600 mt-0.5">
                      Credential ID: {cert.credentialId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerifyCredential(cert.id, false)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 border border-rose-200"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    id={`btn-verify-cert-${cert.id}`}
                    onClick={() => handleVerifyCredential(cert.id, true)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Verify</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingSkills.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                All verification requests have been audited. No pending documents!
              </div>
            )}
          </div>

          {verifiedLog.length > 0 && (
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">Audit Action Log</h5>
              {verifiedLog.map((log, i) => (
                <div key={i} className="text-xs flex items-center justify-between text-slate-600">
                  <span>{log.title} marked as <strong>{log.status}</strong> by {log.verifier}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{log.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SKILL TAXONOMY MANAGER */}
      {activeTab === 'taxonomy' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search canonical skill by name, category, or alias (e.g. 'py', 'k8s')..."
                value={searchTaxonomy}
                onChange={e => setSearchTaxonomy(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              onClick={() => setShowAddSkillModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Canonical Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSkills.map(sk => (
              <div key={sk.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900">{sk.name}</h5>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {sk.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{sk.description}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                  Aliases: {sk.aliases.join(', ') || 'none'}
                </div>
              </div>
            ))}
          </div>

          {/* Add Skill Modal */}
          {showAddSkillModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Add Canonical Skill</h3>
                  <button onClick={() => setShowAddSkillModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>

                <form onSubmit={handleCreateSkill} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Canonical Skill Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GraphQL Architecture"
                      value={newSkillName}
                      onChange={e => setNewSkillName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newSkillCategory}
                      onChange={e => setNewSkillCategory(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Languages">Languages</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Data & AI">Data & AI</option>
                      <option value="Security">Security</option>
                      <option value="Core CS">Core CS</option>
                      <option value="Soft Skills">Soft Skills</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Aliases (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. gql, apollo-graphql"
                      value={newSkillAliases}
                      onChange={e => setNewSkillAliases(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddSkillModal(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs"
                    >
                      Add to Taxonomy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
