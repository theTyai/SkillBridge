import React, { useState } from 'react';
import { Opportunity, StudentProfile, Application } from '../types';
import { calculateOpportunityMatch } from '../utils/matchingEngine';
import {
  X,
  Send,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface ApplyModalProps {
  opportunity: Opportunity | null;
  student: StudentProfile;
  onClose: () => void;
  onSubmitApplication: (app: Partial<Application>) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  opportunity,
  student,
  onClose,
  onSubmitApplication
}) => {
  if (!opportunity) return null;

  const match = calculateOpportunityMatch(student, opportunity);
  const [coverNote, setCoverNote] = useState(
    `I am enthusiastic to apply for the ${opportunity.title} position at ${opportunity.companyName}. My verified background in ${match.matchedSkills.slice(0, 3).join(', ')} directly aligns with your team's mission.`
  );
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitApplication({
        id: `app-${Date.now()}`,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        companyName: opportunity.companyName,
        companyLogo: opportunity.companyLogo,
        studentId: student.userId,
        studentName: 'Arjun Sharma',
        studentEmail: 'student@demo.com',
        studentBranch: student.branch,
        studentCgpa: student.cgpa,
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        status: 'Applied',
        appliedAt: new Date().toISOString().split('T')[0],
        resumeUrl: student.resumeUrl || '/documents/Arjun_Sharma_Backend_Resume.pdf',
        coverNote,
        matchScore: match.overallScore,
        events: [
          {
            id: `evt-${Date.now()}`,
            status: 'Applied',
            note: 'Application submitted through SkillBridge Campus Direct Gateway.',
            createdAt: new Date().toLocaleDateString(),
            createdBy: 'Arjun Sharma'
          }
        ]
      });
      setIsSubmitting(false);
      onClose();
      alert(`Application submitted to ${opportunity.companyName}! You can track it in your Applications Pipeline.`);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={opportunity.companyLogo}
              alt={opportunity.companyName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                Application Form
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1 font-display">
                {opportunity.title}
              </h3>
              <p className="text-xs text-slate-500">
                {opportunity.companyName} • {opportunity.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Match & Verification Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700 font-medium">
                Verified Candidate Profile Linked ({student.institutionName})
              </span>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
              {match.overallScore}% Compatibility
            </span>
          </div>

          {/* Resume Selection */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Attached Verified Resume</label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">Arjun_Sharma_Backend_Resume.pdf</span>
                <span className="text-[10px] text-slate-400 font-mono">(Updated Feb 2026)</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified Evidence Attached
              </span>
            </div>
          </div>

          {/* Cover Note */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Statement of Interest / Cover Note</label>
            <textarea
              rows={3}
              required
              value={coverNote}
              onChange={e => setCoverNote(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Screening Questions if defined */}
          {opportunity.applicationQuestions && opportunity.applicationQuestions.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700 block">Recruiter Application Questions:</span>
              {opportunity.applicationQuestions.map((q, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-slate-600 font-medium">{i + 1}. {q}</label>
                  <input
                    type="text"
                    required
                    placeholder="Your answer..."
                    value={answers[i] || ''}
                    onChange={e => setAnswers({ ...answers, [i]: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting...' : 'Submit Application'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
