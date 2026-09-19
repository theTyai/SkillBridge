import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, CircleHelp, FilePenLine, LogOut, MessageSquarePlus, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/** A deliberately quiet signed-in header. Navigation belongs to the workspace,
 * while account actions stay under the student's profile. */
export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const name = currentUser?.profile?.name || currentUser?.email?.split('@')[0] || 'Student';
  const avatar = currentUser?.profile?.avatarUrl;
  const initials = name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const isStudent = currentUser?.role === 'STUDENT';
  const navigate = (tab: string) => { setActiveTab(tab); setOpen(false); };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071326]/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => isStudent ? navigate('overview') : window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left" aria-label="Go to dashboard">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-white shadow-[0_8px_24px_rgba(59,130,246,.35)]"><Sparkles className="h-5 w-5" /></span>
          <span><span className="block font-display text-lg font-extrabold tracking-tight text-white">SkillBridge <span className="text-cyan-300">AI</span></span><span className="hidden text-[10px] font-medium tracking-wide text-slate-400 sm:block">CAREER INTELLIGENCE</span></span>
        </button>

        {currentUser && <div className="relative" ref={menuRef}>
          <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] py-1.5 pl-1.5 pr-2.5 text-left transition hover:border-cyan-300/30 hover:bg-white/[.09]" aria-haspopup="menu" aria-expanded={open}>
            {avatar ? <img src={avatar} alt="" className="h-8 w-8 rounded-lg object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-[11px] font-bold text-white">{initials}</span>}
            <span className="hidden min-w-0 sm:block"><span className="block max-w-32 truncate text-xs font-bold text-white">{name}</span><span className="block text-[10px] text-slate-400">{isStudent ? 'Student' : currentUser.role.replace('_', ' ')}</span></span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && <div role="menu" className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#101d35]/95 p-1.5 shadow-2xl shadow-slate-950/50 backdrop-blur-2xl">
            <div className="border-b border-white/10 px-3 py-2.5"><p className="text-xs font-bold text-white">{name}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{currentUser.email}</p></div>
            {isStudent && <><button role="menuitem" onClick={() => navigate('portfolio')} className="menu-item"><FilePenLine />Edit profile</button><button role="menuitem" onClick={() => navigate('portfolio')} className="menu-item"><Settings />Settings & privacy</button></>}
            <a role="menuitem" href="mailto:support@skillbridge.ai?subject=SkillBridge%20feedback" className="menu-item" onClick={() => setOpen(false)}><MessageSquarePlus />Submit feedback</a>
            <a role="menuitem" href="mailto:support@skillbridge.ai?subject=SkillBridge%20help" className="menu-item" onClick={() => setOpen(false)}><CircleHelp />Help centre</a>
            <div className="my-1 border-t border-white/10" />
            <button role="menuitem" onClick={() => { setOpen(false); signOut(); }} className="menu-item text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"><LogOut />Log out</button>
          </div>}
        </div>}
      </div>
    </header>
  );
};
