import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, User, Briefcase, GraduationCap, Building, Sparkles, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from './Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'RECRUITER' | 'ACADEMICIAN' | 'INSTITUTION_ADMIN'>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { fetchMe } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setPassword('');
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'register') {
        // Register using Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: role
            }
          }
        });

        if (error) throw error;

        // If email confirmation is disabled, session should exist
        if (data.session) {
          // Sync with our backend
          await api.post('/auth/sync');
          await fetchMe();
          showToast('Registration successful!', 'success');
          onClose();
        } else {
          showToast('Please check your email to confirm registration.', 'success');
          onClose();
        }
      } else {
        // Login using Supabase Auth
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Sync and fetch profile
        await api.post('/auth/sync');
        await fetchMe();
        showToast('Welcome back!', 'success');
        onClose();
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="glass-panel float-in w-full max-w-md overflow-hidden rounded-[1.75rem] relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-full transition-colors z-10"
          aria-label="Close authentication dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 sm:p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200"><Sparkles className="h-5 w-5" /></div>
            <h2 id="auth-title" className="text-2xl font-bold text-white font-display">Welcome to SkillBridge</h2>
            <p className="text-sm text-slate-300 mt-2">
              {activeTab === 'login' ? 'Welcome back! Please enter your details.' : 'Join the career intelligence platform.'}
            </p>
          </div>

          <div className="flex bg-white/[.06] p-1 rounded-xl mb-6 border border-white/10">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'login' ? 'bg-white/[.12] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'register' ? 'bg-white/[.12] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[.08] text-white placeholder:text-slate-500 pl-9 pr-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2">I am a...</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'STUDENT', label: 'Student', icon: <GraduationCap className="w-4 h-4" /> },
                      { id: 'RECRUITER', label: 'Recruiter', icon: <Briefcase className="w-4 h-4" /> },
                      { id: 'ACADEMICIAN', label: 'Faculty', icon: <User className="w-4 h-4" /> },
                      { id: 'INSTITUTION_ADMIN', label: 'Institution', icon: <Building className="w-4 h-4" /> }
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id as any)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all ${
                          role === r.id 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                            : 'border-white/10 bg-white/[.04] hover:border-white/30 text-slate-300'
                        }`}
                      >
                        {r.icon}
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[.08] text-white placeholder:text-slate-500 pl-9 pr-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[.08] text-white placeholder:text-slate-500 pl-9 pr-10 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
