import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, GraduationCap, LoaderCircle } from 'lucide-react';
import api from '../lib/api';
import { showToast } from './Toast';

interface Institution { id: string; name: string; city?: string | null; }

export const StudentOnboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ institutionId: '', studentRollNo: '', degree: '', branch: '', graduationYear: '', cgpa: '', targetRole: '' });

  useEffect(() => {
    api.get('/students/institutions')
      .then(response => setInstitutions(response.data.data || []))
      .catch(() => showToast('We could not load institutions. Please try again.', 'error'))
      .finally(() => setLoadingInstitutions(false));
  }, []);

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(current => ({ ...current, [key]: event.target.value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/students/me', { ...form, targetRoles: [form.targetRole], bio: '' });
      showToast('Your career profile is ready. Add your resume and projects next.', 'success');
      onComplete();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'We could not create your profile.', 'error');
    } finally { setSubmitting(false); }
  };

  return <div className="mx-auto max-w-5xl px-4 py-8 sm:py-14">
    <div className="grid overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#0d1b35]/80 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:grid-cols-[.85fr_1.15fr]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.22),transparent_18rem),linear-gradient(145deg,#101f54,#0a1831)] p-8 sm:p-10 lg:border-b-0 lg:border-r">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200"><GraduationCap className="h-6 w-6" /></div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-cyan-300">Welcome to SkillBridge</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">Build your trusted career profile.</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">Start with your academic identity. You can then add evidence, complete assessments, and request institution verification before applying.</p>
        <div className="mt-10 space-y-4 text-sm text-slate-300">
          {['Academic identity', 'Career goals', 'Evidence & verification'].map((step, index) => <div key={step} className="flex items-center gap-3"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-cyan-400 text-slate-950' : 'border border-white/20 text-slate-400'}`}>{index + 1}</span>{step}</div>)}
        </div>
      </div>
      <form onSubmit={submit} className="p-8 sm:p-10">
        <div className="mb-7"><h2 className="font-display text-xl font-bold text-white">Your academic details</h2><p className="mt-1 text-sm text-slate-400">This is used to connect you with your institution.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field sm:col-span-2">Institution<select required value={form.institutionId} onChange={update('institutionId')} disabled={loadingInstitutions}><option value="">{loadingInstitutions ? 'Loading institutions…' : 'Select your institution'}</option>{institutions.map(institution => <option key={institution.id} value={institution.id}>{institution.name}{institution.city ? ` · ${institution.city}` : ''}</option>)}</select></label>
          <label className="field">Student ID<input required value={form.studentRollNo} onChange={update('studentRollNo')} placeholder="e.g. 22CSE104" /></label>
          <label className="field">Graduation year<input required type="number" min="2024" max="2040" value={form.graduationYear} onChange={update('graduationYear')} placeholder="2027" /></label>
          <label className="field">Degree<input required value={form.degree} onChange={update('degree')} placeholder="B.Tech" /></label>
          <label className="field">Branch<input required value={form.branch} onChange={update('branch')} placeholder="Computer Science" /></label>
          <label className="field">CGPA<input required type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={update('cgpa')} placeholder="8.2" /></label>
          <label className="field">Target role<input required value={form.targetRole} onChange={update('targetRole')} placeholder="Backend Engineer" /></label>
        </div>
        <button type="submit" disabled={submitting || loadingInstitutions || institutions.length === 0} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <><span>Continue to career workspace</span><ArrowRight className="h-4 w-4" /></>}</button>
        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-slate-400"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />Your information is only shared with your institution and employers when you choose to apply.</p>
      </form>
    </div>
  </div>;
};
