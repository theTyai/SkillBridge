import React from 'react';
import { User, UserRole, NotificationItem } from '../types';
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
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onResetData?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleSwitch,
  notifications,
  onOpenNotifications,
  onResetData,
  activeTab,
  setActiveTab
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { role: 'student', label: 'Student', icon: <GraduationCap className="w-4 h-4" />, desc: 'Arjun Sharma (CSE)' },
    { role: 'industry', label: 'Industry', icon: <Briefcase className="w-4 h-4" />, desc: 'Novatech Systems' },
    { role: 'academician', label: 'Faculty', icon: <Building2 className="w-4 h-4" />, desc: 'Dr. Ramesh Kumar' },
    { role: 'admin', label: 'Institution', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Apex Institute Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Brand & Global Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-indigo-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  Skill<span className="text-indigo-600">Bridge</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Academia–Industry Career Intelligence Platform
              </p>
            </div>
          </div>

          {/* Persona Switcher Pill Group */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 hidden lg:inline-block">
              Role Mode:
            </span>
            {roles.map(r => {
              const isActive = currentUser.role === r.role;
              return (
                <button
                  key={r.role}
                  id={`btn-switch-role-${r.role}`}
                  onClick={() => onRoleSwitch(r.role)}
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
          <div className="flex items-center gap-2.5">
            {/* Notifications Button */}
            <button
              id="btn-open-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
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
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
              />
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 capitalize">
                  {currentUser.role === 'admin' ? 'Institution Admin' : currentUser.role}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
