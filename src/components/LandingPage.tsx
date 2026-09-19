import React from 'react';
import { ArrowRight, BrainCircuit, BriefcaseBusiness, Building2, CheckCircle2, GraduationCap, ShieldCheck, Sparkles, University } from 'lucide-react';

interface LandingPageProps { onOpenAuth: (mode: 'login' | 'register') => void; }

const signals = ['Institution-verified profiles', 'Explainable AI matching', 'Career evidence, not claims'];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => (
  <div className="landing-shell overflow-hidden">
    <section className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[.94fr_1.06fr] lg:px-8 lg:py-24">
      <div className="landing-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,.08)]">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" /> AI-native career intelligence
        </div>
        <h1 className="mt-7 font-display text-5xl font-extrabold leading-[1.02] tracking-[-.045em] text-white sm:text-6xl lg:text-7xl">
          Build skills.<br />Prove them.<br /><span className="landing-gradient">Get discovered.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">SkillBridge turns your learning, projects, and assessments into a verified career identity that the right employers can trust.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => onOpenAuth('register')} className="cta-primary">Build your career passport <ArrowRight className="h-4 w-4" /></button>
          <button onClick={() => onOpenAuth('login')} className="cta-secondary">Explore SkillBridge</button>
        </div>
        <div className="mt-8 flex flex-col gap-3 text-xs font-medium text-slate-300 sm:flex-row sm:flex-wrap sm:gap-x-5">
          {signals.map(signal => <span key={signal} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />{signal}</span>)}
        </div>
      </div>

      <div className="scene-wrap relative hidden h-[520px] lg:block" aria-label="SkillBridge connects students, industry, academia and institutions">
        <div className="scene-glow scene-glow-one" /><div className="scene-glow scene-glow-two" />
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="orbit-line orbit-line-a" /><div className="orbit-line orbit-line-b" /><div className="orbit-line orbit-line-c" /><div className="orbit-line orbit-line-d" />
        <Satellite className="satellite student-node" icon={<GraduationCap />} title="Student" detail="Learn · Build · Grow" tint="cyan" />
        <Satellite className="satellite industry-node" icon={<BriefcaseBusiness />} title="Industry" detail="Hire · Collaborate · Grow" tint="violet" />
        <Satellite className="satellite institution-node" icon={<Building2 />} title="Institution" detail="Verify · Track · Improve" tint="blue" />
        <Satellite className="satellite academia-node" icon={<University />} title="Academia" detail="Research · Teach · Innovate" tint="fuchsia" />
        <div className="core-node"><div className="core-pulse" /><div className="core-inner"><ShieldCheck className="h-9 w-9 text-cyan-100" /><span>SkillBridge</span><small>AI</small></div></div>
      </div>
    </section>

    <section className="border-y border-white/[.08] bg-[#09172c]/55">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">One platform. Four stakeholders.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Value icon={<GraduationCap />} title="Students" text="Build evidence and get discovered." />
          <Value icon={<BriefcaseBusiness />} title="Industry" text="Hire verified, relevant talent." />
          <Value icon={<Building2 />} title="Institutions" text="Track outcomes and verify skills." />
          <Value icon={<University />} title="Academia" text="Connect learning to opportunity." />
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
      <div className="self-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">Career intelligence</p><h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">One trusted signal, from effort to opportunity.</h2><p className="mt-4 leading-relaxed text-slate-300">A career passport connects work you can prove with opportunities you are genuinely ready for. Every recommendation tells you why.</p><button onClick={() => onOpenAuth('register')} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-cyan-200 hover:text-white">See how SkillBridge works <ArrowRight className="h-4 w-4" /></button></div>
      <div className="match-console">
        <div className="flex items-start justify-between border-b border-white/10 pb-5"><div className="flex gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white"><BrainCircuit className="h-5 w-5" /></span><div><h3 className="font-display text-lg font-bold text-white">Backend Engineer</h3><p className="text-xs text-slate-400">Novatech Systems · Remote · Internship</p></div></div><div className="text-right"><b className="text-3xl text-emerald-300">91%</b><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">match signal</p></div></div>
        <div className="grid gap-6 pt-5 sm:grid-cols-2"><div className="space-y-4">{[['Skills alignment', 92], ['Project relevance', 88], ['Assessment evidence', 84]].map(([label, score]) => <div key={String(label)}><div className="mb-1.5 flex justify-between text-xs text-slate-300"><span>{label}</span><b>{score}%</b></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" style={{ width: `${score}%` }} /></div></div>)}</div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Why this match</p><ul className="mt-3 space-y-2 text-xs text-slate-200"><li>✓ Node.js verified</li><li>✓ REST APIs verified</li><li>✓ Backend project evidence</li><li className="pt-2 text-amber-200">△ Improve: System Design</li></ul></div></div>
      </div>
    </section>
  </div>
);

const Satellite: React.FC<{ className: string; icon: React.ReactNode; title: string; detail: string; tint: string }> = ({ className, icon, title, detail, tint }) => <div className={`${className} depth-card`}><span className={`node-icon node-${tint}`}>{icon}</span><span><b>{title}</b><small>{detail}</small></span></div>;
const Value: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => <div className="value-card"><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></div>;
