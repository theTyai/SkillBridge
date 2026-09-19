import React, { useState, useEffect } from 'react';
import { Assessment, StudentSkill } from '../types';
import {
  X,
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

import { useEscapeKey } from '../hooks/useEscapeKey';

interface AssessmentRunnerModalProps {
  assessment: Assessment;
  onClose: () => void;
  onComplete: (score: number, updatedSkills: Partial<StudentSkill>[]) => void;
}

export const AssessmentRunnerModal: React.FC<AssessmentRunnerModalProps> = ({
  assessment,
  onClose,
  onComplete
}) => {
  useEscapeKey(onClose);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(assessment.durationMinutes * 60);
  const [isTimed, setIsTimed] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Keep a fresh reference to handleSubmit for the timer
  const handleSubmitRef = React.useRef<() => void>(() => {});
  React.useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  // Timer
  useEffect(() => {
    if (!isTimed || isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimed, isSubmitted]);

  const currentQ = assessment.questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / assessment.questions.length) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (qId: string, optId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = () => {
    let totalPoints = 0;
    const skillScores: Record<string, { points: number; count: number; name: string }> = {};

    assessment.questions.forEach(q => {
      const chosenOptId = selectedAnswers[q.id];
      const chosenOpt = q.options?.find(o => o.id === chosenOptId);
      const points = chosenOpt ? chosenOpt.points : 0;
      totalPoints += points;

      if (!skillScores[q.skillId]) {
        skillScores[q.skillId] = { points: 0, count: 0, name: q.skillName };
      }
      skillScores[q.skillId].points += points;
      skillScores[q.skillId].count += 1;
    });

    const calculatedScore = assessment.questions.length > 0 
      ? Math.round(totalPoints / assessment.questions.length) 
      : 0;
    setFinalScore(calculatedScore);
    setIsSubmitted(true);

    // Prepare updated skills
    const updatedSkills: Partial<StudentSkill>[] = Object.entries(skillScores).map(([skillId, stat]) => {
      const proficiency = Math.round(stat.points / stat.count);
      let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' = 'Intermediate';
      if (proficiency >= 85) level = 'Expert';
      else if (proficiency >= 70) level = 'Advanced';
      else if (proficiency >= 50) level = 'Intermediate';
      else level = 'Beginner';

      return {
        skillId,
        name: stat.name,
        proficiency,
        level,
        source: 'assessed',
        verified: proficiency >= 65,
        assessedAt: new Date().toISOString().split('T')[0]
      };
    });

    onComplete(calculatedScore, updatedSkills);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                {assessment.capability}
              </span>
              <span className="text-xs text-slate-500">
                Question {currentIdx + 1} of {assessment.questions.length}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1 font-display">
              {assessment.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <Clock className={`w-4 h-4 ${secondsLeft < 180 ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`} />
                <span className={`text-xs font-mono font-bold ${secondsLeft < 180 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatTime(secondsLeft)}
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimed(!isTimed)}
                  className="text-[10px] text-indigo-600 hover:underline pl-1 border-l border-slate-200"
                >
                  {isTimed ? 'Pause' : 'Resume'}
                </button>
              </div>
            )}
            <button
              id="btn-close-assessment"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-indigo-600 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Body */}
        {!isSubmitted ? (
          <div className="p-6 space-y-6">
            
            {/* Skill Target */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Target Skill: <strong className="text-slate-800">{currentQ.skillName}</strong>
              </span>
              <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px]">
                {currentQ.type}
              </span>
            </div>

            {/* Question Prompt */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {currentQ.prompt}
              </p>
              {currentQ.scenarioCode && (
                <pre className="mt-3 p-3 rounded-lg bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto">
                  <code>{currentQ.scenarioCode}</code>
                </pre>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options?.map((opt, i) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`opt-choice-${i}`}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-medium shadow-xs ring-1 ring-indigo-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIdx < assessment.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="btn-submit-assessment-answers"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit & Calculate Proficiency</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* Results View */
          <div className="p-8 text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Assessment Completed
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2 font-display">
                Normalized Proficiency: {finalScore}%
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your skill graph and verified profile have been updated. Recruiters reviewing your Career Passport will see verified capability evidence.
              </p>
            </div>

            {/* Breakdown per question explanation */}
            <div className="text-left space-y-3 max-h-60 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">Question Reviews & Explanations:</h5>
              {assessment.questions.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const selectedOpt = q.options?.find(o => o.id === userChoice);
                const isCorrect = selectedOpt ? selectedOpt.points === 100 : false;

                return (
                  <div key={q.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800">Q{idx + 1}: {q.skillName}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isCorrect ? '+100 pts (Correct)' : 'Partial / Incorrect'}
                      </span>
                    </div>
                    {q.explanation && (
                      <p className="text-slate-500 text-[11px] italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              id="btn-return-dashboard"
              onClick={onClose}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Return to Career Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
