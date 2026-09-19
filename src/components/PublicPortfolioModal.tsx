import React, { useState } from 'react';
import { StudentProfile } from '../types';
import {
  X,
  QrCode,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Github,
  Linkedin,
  FileText,
  Lock,
  Globe,
  Award
} from 'lucide-react';

import { useEscapeKey } from '../hooks/useEscapeKey';

interface PublicPortfolioModalProps {
  student: StudentProfile;
  onClose: () => void;
  onTogglePrivacy: (isPublic: boolean) => void;
}

export const PublicPortfolioModal: React.FC<PublicPortfolioModalProps> = ({
  student,
  onClose,
  onTogglePrivacy
}) => {
  useEscapeKey(onClose);
  const [copied, setCopied] = useState(false);
  const publicUrl = `https://skillbridge.edu/passport/${student.portfolioSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header Bar */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Verifiable Career Passport & Public Portfolio
              </h3>
              <p className="text-xs text-slate-500">
                Tamper-resistant digital portfolio with verified academic & industry credentials
              </p>
            </div>
          </div>
          <button
            id="btn-close-passport-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Shareable Link & Privacy Controls */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onTogglePrivacy(!student.isPublic)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  student.isPublic
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-amber-50 text-amber-700 border-amber-300'
                }`}
              >
                {student.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{student.isPublic ? 'Passport is Public' : 'Passport is Restricted'}</span>
              </button>
              <span className="text-xs text-slate-500 hidden md:inline">
                {student.isPublic ? 'Accessible via direct link or QR scan' : 'Visible only to verified campus recruiters'}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 font-mono w-full sm:w-64 select-all"
              />
              <button
                id="btn-copy-passport-link"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Live Passport Card Preview */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
            {/* Background watermarks */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck className="w-64 h-64" />
            </div>

            <div className="relative z-10 space-y-6">
              
              {/* Card Top */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 p-0.5 ring-2 ring-indigo-400/40">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                      alt="Student"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold font-display tracking-tight text-white">
                        Arjun Sharma
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Campus Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {student.institutionName} • Class of {student.graduationYear}
                    </p>
                    <p className="text-xs text-indigo-200/80 font-mono mt-0.5">
                      ID: {student.studentId} • CGPA: {student.cgpa} / 10.0
                    </p>
                  </div>
                </div>

                {/* QR Code preview block */}
                <div className="p-2.5 rounded-xl bg-white text-slate-900 flex flex-col items-center justify-center shadow-lg shrink-0">
                  {/* Styled SVG QR Code representation */}
                  <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-lg grid grid-cols-4 gap-1">
                    <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                  </div>
                  <span className="text-[9px] font-bold font-mono tracking-wider text-slate-600 mt-1 uppercase">
                    Scan to Verify
                  </span>
                </div>
              </div>

              {/* Bio & Target */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Target Capabilities:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {student.targetRoles.map(r => (
                    <span key={r} className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-xs font-medium border border-white/15">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Skills Grid */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Verified & Assessed Capabilities:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
                  {student.skills.slice(0, 6).map(s => (
                    <div key={s.skillId} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate mr-2">{s.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        s.verified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {s.proficiency}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Certifications */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Verified Credentials:</span>
                <div className="space-y-1.5 mt-1.5">
                  {student.certifications.filter(c => c.verificationStatus === 'verified').map(c => (
                    <div key={c.id} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-white font-medium">{c.title}</span>
                        <span className="text-indigo-300 text-[11px]">({c.issuer})</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">Verified by Apex Cell</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                alert('Exporting PDF snapshot of verifiable Career Passport...');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Passport</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
