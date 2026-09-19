import React from 'react';
import { UserRole, NotificationItem } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Bell,
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onResetData?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  notifications,
  onOpenNotifications,
  onResetData,
  activeTab,
  setActiveTab
}) => {
  const { currentUser, signInAsDevUser, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: { role: UserRole; email: string; label: string; icon: React.ReactNode; desc: string }[] = [
    { role: 'student', email: 'arjun.sharma@apex.edu.in', label: 'Student', icon: <GraduationCap className="w-4 h-4" />, desc: 'Arjun Sharma (CSE)' },
    { role: 'industry', email: 'recruiter@novatech.com', label: 'Industry', icon: <Briefcase className="w-4 h-4" />, desc: 'Novatech Systems' },
    { role: 'academician', email: 'ramesh.kumar@apex.edu.in', label: 'Faculty', icon: <Building2 className="w-4 h-4" />, desc: 'Dr. Ramesh Kumar' },
    { role: 'admin', email: 'admin@apex.edu.in', label: 'Institution', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Apex Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Brand & Global Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Hamburger (Mobile) */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="space-y-1">
              <div className="w-4 h-0.5 bg-current"></div>
              <div className="w-4 h-0.5 bg-current"></div>
              <div className="w-4 h-0.5 bg-current"></div>
            </div>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            if (currentUser?.role === 'STUDENT') setActiveTab('overview');
            else window.scrollTo(0, 0);
          }}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  Skill<span className="text-indigo-600">Bridge</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-block">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                Academia–Industry Career Intelligence Platform
              </p>
            </div>
          </div>

          {/* Persona Switcher Pill Group (Desktop) */}
          <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 hidden lg:inline-block">
              Role Mode:
            </span>
            {roles.map(r => {
              const isActive = currentUser?.role.toLowerCase() === r.role;
              return (
                <button
                  key={r.role}
                  id={`btn-switch-role-${r.role}`}
                  onClick={() => signInAsDevUser(r.email)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`Switch to ${r.desc}`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right actions: notifications & user avatar */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Notifications Button */}
            <button
              id="btn-open-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Reset Seed Data */}
            {onResetData && (
              <button
                id="btn-reset-seed-data"
                onClick={onResetData}
                className="hidden md:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Reset to default seeded demo state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Reset Data</span>
              </button>
            )}

            {/* Current Persona Badge */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              {currentUser ? (
                <>
                  <img
                    src={currentUser.profile.avatarUrl}
                    alt={currentUser.profile.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
                  />
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.profile.name}
                    </div>
                    <div className="text-[11px] text-slate-500 capitalize">
                      {currentUser.role === 'ADMIN' ? 'Institution Admin' : currentUser.role.toLowerCase()}
                    </div>
                  </div>
                  <button onClick={signOut} className="ml-2 text-slate-400 hover:text-red-500" title="Sign Out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-xs text-slate-500">Not signed in</div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 animate-in slide-in-from-top-2">
            <div className="px-2 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Role Profile</div>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => {
                const isActive = currentUser?.role.toLowerCase() === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      signInAsDevUser(r.email);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
