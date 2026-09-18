import React, { useState } from 'react';
import {
  Opportunity,
  Application,
  LearningProgram,
  CollaborationProject,
  User,
  CanonicalSkill,
  ApplicationStatus
} from '../types';
import {
  Briefcase,
  Users,
  PlusCircle,
  TrendingUp,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  FolderGit2
} from 'lucide-react';

interface IndustryDashboardProps {
  currentUser: User;
  opportunities: Opportunity[];
  applications: Application[];
  learningPrograms: LearningProgram[];
  collaborationProjects: CollaborationProject[];
  canonicalSkills: CanonicalSkill[];
  onCreateOpportunity: (newOpp: Partial<Opportunity>) => void;
  onUpdateApplicationStatus: (appId: string, status: ApplicationStatus, note: string) => void;
}

export const IndustryDashboard: React.FC<IndustryDashboardProps> = ({
  currentUser,
  opportunities,
  applications,
  learningPrograms,
  collaborationProjects,
  canonicalSkills,
  onCreateOpportunity,
  onUpdateApplicationStatus
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'postings' | 'collaborations' | 'analytics'>('pipeline');
  const [selectedOppFilter, setSelectedOppFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Opportunity Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Opportunity['type']>('internship');
  const [newWorkMode, setNewWorkMode] = useState<Opportunity['workMode']>('hybrid');
  const [newLocation, setNewLocation] = useState('Bangalore, India');
  const [newStipend, setNewStipend] = useState('₹45,000 / month');
  const [newDuration, setNewDuration] = useState('6 Months');
  const [newDeadline, setNewDeadline] = useState('2026-05-30');
  const [newOpenings, setNewOpenings] = useState(5);
  const [newDescription, setNewDescription] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(['sk-python', 'sk-sql', 'sk-docker']);

  // Recruiter Action Modal for updating status
  const [activeAppToReview, setActiveAppToReview] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [nextStage, setNextStage] = useState<ApplicationStatus>('Shortlisted');

  // Filtered applications
  const filteredApplications = applications.filter(app => {
    const matchOpp = selectedOppFilter === 'all' || app.opportunityId === selectedOppFilter;
    const matchStatus = selectedStatusFilter === 'all' || app.status === selectedStatusFilter;
    const matchSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentBranch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchOpp && matchStatus && matchSearch;
  });

  const handlePostOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const reqSkills = selectedSkillIds.map(id => {
      const canonical = canonicalSkills.find(s => s.id === id);
      return {
        skillId: id,
        name: canonical ? canonical.name : id,
        requiredLevel: 'Intermediate' as const,
        requiredProficiency: 70,
        required: true
      };
    });

    onCreateOpportunity({
      industryId: currentUser.organizationId || 'org-novatech',
      companyName: currentUser.organizationName || 'Novatech Systems',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      title: newTitle,
      roleId: 'role-backend',
      type: newType,
      description: newDescription || 'Exciting early-career opportunity at Novatech working on cloud-scale systems.',
      location: newLocation,
      workMode: newWorkMode,
      stipendOrSalary: newStipend,
      duration: newDuration,
      deadline: newDeadline,
      openings: Number(newOpenings),
      status: 'published',
      requiredSkills: reqSkills,
      preferredSkills: ['Git & Version Control', 'Redis & Caching'],
      eligibility: {
        minCgpa: 7.5,
        allowedBranches: ['Computer Science & Engineering', 'AI & Data Science'],
        allowedGradYears: [2026, 2027]
      }
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    alert('Opportunity published successfully to university campus marketplace!');
  };

  const handleExecuteStatusUpdate = () => {
    if (!activeAppToReview) return;
    onUpdateApplicationStatus(activeAppToReview.id, nextStage, reviewNote || `Updated status to ${nextStage}`);
    setActiveAppToReview(null);
    setReviewNote('');
    alert(`Candidate moved to ${nextStage}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Company Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"
            alt="Novatech"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-400/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-white">
                {currentUser.organizationName || 'Novatech Systems'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Campus Industry Partner
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Recruiter: <strong>{currentUser.name}</strong> • Head of Engineering Talent
            </p>
          </div>
        </div>

        <button
          id="btn-open-create-opp"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Campus Opportunity</span>
        </button>
      </div>

      {/* Recruiter Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          id="btn-industry-tab-pipeline"
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'pipeline' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Applicant Review Pipeline ({applications.length})</span>
        </button>

        <button
          id="btn-industry-tab-postings"
          onClick={() => setActiveTab('postings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'postings' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Active Opportunities ({opportunities.length})</span>
        </button>

        <button
          id="btn-industry-tab-collaborations"
          onClick={() => setActiveTab('collaborations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'collaborations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Academic Collaborations & Projects</span>
        </button>

        <button
          id="btn-industry-tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Recruitment Funnel Analytics</span>
        </button>
      </div>

      {/* TAB 1: APPLICANT REVIEW PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate by name, branch, or job..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
            >
              <option value="all">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Applicants Table / Cards */}
          <div className="space-y-3">
            {filteredApplications.map(app => (
              <div
                key={app.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={app.studentAvatar}
                    alt={app.studentName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{app.studentName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Applied for <strong className="text-slate-800">{app.opportunityTitle}</strong>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {app.studentBranch} • CGPA: {app.studentCgpa} • Applied: {app.appliedAt}
                    </p>
                  </div>
                </div>

                {/* Compatibility Score & Recruiter Actions */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                      {app.matchScore}% Match
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Explainable Score</div>
                  </div>

                  <button
                    id={`btn-review-applicant-${app.id}`}
                    onClick={() => {
                      setActiveAppToReview(app);
                      setNextStage(app.status);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    Review & Advance Stage
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: ACTIVE POSTINGS */}
      {activeTab === 'postings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map(opp => (
            <div key={opp.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {opp.type}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1 font-display">{opp.title}</h4>
                  <span className="text-xs text-slate-500">{opp.location} • {opp.stipendOrSalary}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {opp.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-600"><strong>{opp.applicantsCount}</strong> Applicants Received</span>
                <span className="text-slate-400">Deadline: {opp.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ACADEMIC COLLABORATIONS */}
      {activeTab === 'collaborations' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Active Academia-Industry Joint Initiatives
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Live research, capstone student mentorships, and national hackathons with Apex Institute.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborationProjects.map(collab => (
              <div key={collab.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                    {collab.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">{collab.status}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-display">{collab.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{collab.description}</p>
                
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Milestones:</span>
                  {collab.milestones.map(m => (
                    <div key={m.id} className="text-xs flex items-center justify-between text-slate-700">
                      <span>{m.title}</span>
                      <span className={m.completed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {m.completed ? 'Completed' : `Due ${m.dueDate}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RECRUITMENT FUNNEL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs text-slate-500">Total Applications</div>
              <div className="text-2xl font-black text-slate-900 mt-1">120</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs text-slate-500">Shortlisted for Rounds</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">34</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs text-slate-500">Technical Interviews</div>
              <div className="text-2xl font-black text-sky-600 mt-1">18</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-xs text-slate-500">Offers Extended</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">8</div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Campus Talent Skill Availability (Apex Institute Batch of 2026)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span>Python & Distributed Systems</span>
                <span className="text-indigo-600">84% Assessed Proficiency</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>

              <div className="flex justify-between font-semibold pt-2">
                <span>SQL & Relational DBs</span>
                <span className="text-indigo-600">82% Assessed Proficiency</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>

              <div className="flex justify-between font-semibold pt-2">
                <span>Docker & Cloud Containers</span>
                <span className="text-amber-600">52% (Candidate Upskilling in Progress)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '52%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: POST NEW OPPORTUNITY */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Post New Campus Opportunity</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handlePostOpportunity} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Cloud Backend Intern"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Opportunity Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="internship">Internship</option>
                    <option value="job">Full-time Job</option>
                    <option value="live_project">Live Capstone Project</option>
                    <option value="apprenticeship">Apprenticeship</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Mode</label>
                  <select
                    value={newWorkMode}
                    onChange={e => setNewWorkMode(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Compensation / Stipend</label>
                  <input
                    type="text"
                    value={newStipend}
                    onChange={e => setNewStipend(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Openings</label>
                  <input
                    type="number"
                    value={newOpenings}
                    onChange={e => setNewOpenings(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Description & Responsibilities</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe the projects, engineering stack, and mentorship provided..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CANDIDATE STAGE ADVANCEMENT */}
      {activeAppToReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Review Candidate: {activeAppToReview.studentName}</h3>
                <span className="text-xs text-slate-500">For {activeAppToReview.opportunityTitle}</span>
              </div>
              <button onClick={() => setActiveAppToReview(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div><strong>CGPA:</strong> {activeAppToReview.studentCgpa} • <strong>Branch:</strong> {activeAppToReview.studentBranch}</div>
                <div><strong>Match Score:</strong> <span className="text-emerald-600 font-bold">{activeAppToReview.matchScore}%</span></div>
                {activeAppToReview.coverNote && (
                  <div className="pt-1 text-slate-600 italic">"{activeAppToReview.coverNote}"</div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Update Pipeline Stage:</label>
                <select
                  value={nextStage}
                  onChange={e => setNextStage(e.target.value as ApplicationStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected (Offer)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Internal Recruiter Note & Feedback:</label>
                <textarea
                  rows={2}
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                  placeholder="e.g. Cleared technical screen. Schedule system design panel."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveAppToReview(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleExecuteStatusUpdate}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save & Notify Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
