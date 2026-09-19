import React from 'react';
import { Opportunity, MatchScoreExplanation } from '../types';
import {
  X,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  MapPin
} from 'lucide-react';

import { useEscapeKey } from '../hooks/useEscapeKey';

interface MatchExplanationModalProps {
  opportunity: Opportunity | null;
  matchExplanation: MatchScoreExplanation | null;
  onClose: () => void;
  onApply?: () => void;
}

export const MatchExplanationModal: React.FC<MatchExplanationModalProps> = ({
  opportunity,
  matchExplanation,
  onClose,
  onApply
}) => {
  useEscapeKey(onClose);

  if (!opportunity || !matchExplanation) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreRing = (score: number) => {
    if (score >= 80) return 'border-emerald-500 text-emerald-700 bg-emerald-50';
    if (score >= 60) return 'border-amber-500 text-amber-700 bg-amber-50';
    return 'border-rose-500 text-rose-700 bg-rose-50';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={opportunity.companyLogo}
              alt={opportunity.companyName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                  Explainable Match Breakdown
                </span>
                {!matchExplanation.isEligible && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Hard Filter Alert
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1 font-display">
                {opportunity.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{opportunity.companyName}</span>
                <span>•</span>
                <span className="capitalize">{opportunity.workMode}</span>
                <span>•</span>
                <span>{opportunity.stipendOrSalary}</span>
              </p>
            </div>
          </div>
          <button
            id="btn-close-match-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center font-display font-extrabold ${getScoreRing(matchExplanation.overallScore)}`}>
                <span className="text-xl leading-none">{matchExplanation.overallScore}%</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75">Match</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {matchExplanation.overallScore >= 80 ? 'High Compatibility Recommendation' : matchExplanation.overallScore >= 60 ? 'Moderate Compatibility' : 'Low Compatibility (Gaps Found)'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
                  Transparent multi-factor score based on mandatory skills, verified proficiency, role alignment, and eligibility.
                </p>
              </div>
            </div>

            {onApply && (
              <button
                id="btn-match-apply-now"
                onClick={() => {
                  onClose();
                  onApply();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Apply</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Hard Eligibility Constraints */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Mandatory Academic Eligibility Checks
            </h5>
            {matchExplanation.isEligible ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You meet all academic hard constraints (CGPA, degree branch, and graduation batch).</span>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Does not meet one or more mandatory eligibility constraints:</span>
                </div>
                <ul className="list-disc list-inside pl-2 space-y-0.5 text-rose-700">
                  {matchExplanation.eligibilityNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 6-Factor Mathematical Formula Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Score Component Breakdown (Baseline Algorithm)
              </h5>
              <span className="text-[11px] text-slate-500 italic">Deterministic</span>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              
              {/* Factor 1: Required Skills (55%) */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                  <span className="flex items-center gap-1">
                    <span>Required Skills Coverage</span>
                    <span className="text-[10px] text-slate-600 font-medium">(55% Weight)</span>
                  </span>
                  <span className="font-bold text-slate-900">{matchExplanation.requiredSkillScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${matchExplanation.requiredSkillScore}%` }}></div>
                </div>
              </div>

              {/* Factor 2: Proficiency Fit (15%) */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                  <span className="flex items-center gap-1">
                    <span>Proficiency Depth Fit</span>
                    <span className="text-[10px] text-slate-600 font-medium">(15% Weight)</span>
                  </span>
                  <span className="font-bold text-slate-900">{matchExplanation.proficiencyFitScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-500 h-2 rounded-full transition-all duration-300" style={{ width: `${matchExplanation.proficiencyFitScore}%` }}></div>
                </div>
              </div>

              {/* Factor 3: Preferred Skills (10%) */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                  <span className="flex items-center gap-1">
                    <span>Preferred Skills Alignment</span>
                    <span className="text-[10px] text-slate-600 font-medium">(10% Weight)</span>
                  </span>
                  <span className="font-bold text-slate-900">{matchExplanation.preferredSkillScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-violet-500 h-2 rounded-full transition-all duration-300" style={{ width: `${matchExplanation.preferredSkillScore}%` }}></div>
                </div>
              </div>

              {/* Factor 4: Role Interest (10%) */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                  <span className="flex items-center gap-1">
                    <span>Target Career Role Fit</span>
                    <span className="text-[10px] text-slate-600 font-medium">(10% Weight)</span>
                  </span>
                  <span className="font-bold text-slate-900">{matchExplanation.roleInterestScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${matchExplanation.roleInterestScore}%` }}></div>
                </div>
              </div>

              {/* Factor 5 & 6: Work Mode + Completeness (5% + 5%) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Work Mode (5%)</span>
                    <span className="font-bold text-slate-900">{matchExplanation.workModeScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${matchExplanation.workModeScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Passport Profile (5%)</span>
                    <span className="font-bold text-slate-900">{matchExplanation.profileCompletenessScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${matchExplanation.profileCompletenessScore}%` }}></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Matched Skills vs Skill Gaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Matched Skills */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <h6 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Matched Skills ({matchExplanation.matchedSkills.length})
              </h6>
              {matchExplanation.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {matchExplanation.matchedSkills.map(s => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 italic">No skills matched directly.</p>
              )}
            </div>

            {/* Missing / Gap Skills */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <h6 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Actionable Skill Gaps ({matchExplanation.missingSkills.length})
              </h6>
              {matchExplanation.missingSkills.length > 0 ? (
                <div className="space-y-2">
                  {matchExplanation.missingSkills.map(g => (
                    <div key={g.skill} className="text-xs bg-white/80 p-2 rounded-lg border border-amber-200/60 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{g.skill}</span>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        {g.currentProficiency > 0 ? `Current ${g.currentProficiency}% → Req ${g.requiredProficiency}%` : `Missing (Req ${g.requiredProficiency}%)`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">All mandatory skills matched at or above required proficiency!</p>
              )}
            </div>

          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center leading-relaxed">
            Note: SkillBridge matching provides a transparent compatibility estimate to guide learning and recruitment, never an automated black-box hiring verdict.
          </div>

        </div>

      </div>
    </div>
  );
};
