import React, { useState } from 'react';
import {
  FacultyOpportunity,
  CollaborationProject,
  User
} from '../types';
import {
  Building2,
  BookOpen,
  Briefcase,
  Award,
  Search,
  ExternalLink,
  CheckCircle2,
  FolderGit2,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';

interface FacultyDashboardProps {
  currentUser: User;
  facultyOpportunities: FacultyOpportunity[];
  collaborationProjects: CollaborationProject[];
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  currentUser,
  facultyOpportunities,
  collaborationProjects
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [registeredIds, setRegisteredIds] = useState<string[]>(['fac-3']);

  const filteredOpps = facultyOpportunities.filter(
    opp => selectedType === 'all' || opp.type === selectedType
  );

  const handleRegister = (id: string, title: string) => {
    setRegisteredIds(prev => [...prev, id]);
    alert(`Successfully registered for "${title}". Confirmation has been sent to your academic email.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Faculty Profile Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-white">
                {currentUser.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold">
                Senior Faculty & Principal Investigator
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Dept. of Computer Science & Engineering • Head of Distributed Systems Lab
            </p>
            <p className="text-[11px] text-indigo-300/80 mt-1">
              Apex Institute of Technology • 24 Research Publications • 3 Industry Patents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-emerald-400">Consultancy Status</div>
            <div className="text-[11px] text-slate-300">Open for Industry Audit & Grants</div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Sponsored R&D Grants</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">₹14.2 Lakhs</div>
          <div className="text-[11px] text-emerald-600 mt-1">2 Active Lab Projects</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Industry Sabbaticals / FDPs</div>
          <div className="text-xl font-extrabold text-indigo-600 mt-1">4 Completed</div>
          <div className="text-[11px] text-slate-500 mt-1">AICTE Certified</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Student Teams Mentored</div>
          <div className="text-xl font-extrabold text-sky-600 mt-1">12 Teams</div>
          <div className="text-[11px] text-slate-500 mt-1">Novatech & DataMesh live projects</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500">Consultancy Engagements</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">3 Retainers</div>
          <div className="text-[11px] text-slate-500 mt-1">Fintech & Cloud Systems</div>
        </div>
      </div>

      {/* Faculty Opportunities Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Industry Engagement Opportunities for Faculty
            </h3>
            <p className="text-xs text-slate-500">
              Faculty Fellowships, Industrial Training, AICTE FDPs, Consultancy, and Research Grants.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
            >
              <option value="all">All Engagement Types</option>
              <option value="Faculty Internship">Faculty Internships</option>
              <option value="FDP">FDP Programs</option>
              <option value="Consultancy">Consultancy</option>
              <option value="Research Collaboration">Research Grants</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpps.map(opp => {
            const isRegistered = registeredIds.includes(opp.id);
            return (
              <div key={opp.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {opp.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Deadline: {opp.deadline}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-2 font-display">
                    {opp.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    Partner: {opp.companyName} • {opp.location}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Grant / Stipend:</span>
                    <span className="font-bold text-emerald-700">{opp.stipendOrGrant}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{opp.duration}</span>
                  {isRegistered ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(opp.id, opp.title)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      Express Interest / Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Research & Live Projects Hub */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-display">
          Active Student Capstone & Lab Collaborations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collaborationProjects.map(collab => (
            <div key={collab.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  {collab.type}
                </span>
                <span className="text-xs font-semibold text-emerald-600">{collab.status}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-display">{collab.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{collab.description}</p>
              
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Milestones Completed</span>
                  <span>{collab.milestones.filter(m => m.completed).length} of {collab.milestones.length}</span>
                </div>
                {collab.milestones.map(m => (
                  <div key={m.id} className="text-xs flex items-center justify-between text-slate-700 bg-slate-50 p-2 rounded-lg">
                    <span>{m.title}</span>
                    <span className={m.completed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {m.completed ? '✓ Completed' : `Due ${m.dueDate}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
