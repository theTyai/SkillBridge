import React, { useState } from 'react';
import {
  StudentProfile,
  Opportunity,
  Application,
  Assessment,
  LearningProgram,
  LearningEnrollment,
  CareerRole,
  MatchScoreExplanation,
  StudentSkill,
  User
} from '../types';
import { calculateOpportunityMatch } from '../utils/matchingEngine';
import {
  LayoutDashboard,
  Target,
  Award,
  Briefcase,
  Layers,
  BookOpen,
  FileCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  Send,
  Upload,
  Cpu,
  Compass,
  FileText,
  Building,
  MapPin,
  Calendar,
  ChevronRight,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { showToast } from './Toast';
import { generateRoadmapWithGemini, generateInterviewPrep, AIRoadmapResponse, AIInterviewQuestion } from '../utils/aiAPI';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { StudentOnboarding } from './StudentOnboarding';

interface StudentDashboardProps {
  currentUser: User;
  assessments: Assessment[];
  learningPrograms: LearningProgram[];
  careerRoles: CareerRole[];
  onOpenAssessment: (assessment: Assessment) => void;
  onOpenMatchDetails: (opp: Opportunity, explanation: MatchScoreExplanation) => void;
  onOpenApply: (opp: Opportunity) => void;
  onOpenPassport: () => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  assessments,
  learningPrograms,
  careerRoles,
  onOpenAssessment,
  onOpenMatchDetails,
  onOpenApply,
  onOpenPassport,
  activeSubTab,
  setActiveSubTab
}) => {
  const queryClient = useQueryClient();
  const { signOut } = useAuth();

  // React Query Fetchers
  const { data: studentRes, isLoading: isLoadingStudent, error: studentError, refetch: refetchStudent } = useQuery({
    queryKey: ['student', 'profile'],
    queryFn: async () => {
      const res = await api.get('/students/me');
      const data = res.data.data;
      // Map Prisma response to expected frontend shape
      if (data && data.skills) {
        data.skills = data.skills.map((s: any) => ({
          ...s,
          name: s.canonicalSkill?.name || 'Unknown',
          level: s.proficiency >= 80 ? 'Advanced' : s.proficiency >= 60 ? 'Intermediate' : 'Beginner'
        }));
      }
      return data;
    },
    retry: 1
  });

  const { data: opportunitiesRes, isLoading: isLoadingOpps } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const res = await api.get('/opportunities');
      const data = res.data.data;
      return data.map((o: any) => ({
        ...o,
        companyName: o.organization?.name,
        companyLogo: o.organization?.logoUrl,
        requiredSkills: o.requiredSkills?.map((rs: any) => ({
          ...rs,
          name: rs.canonicalSkill?.name
        })) || []
      }));
    }
  });

  const { data: applicationsRes, isLoading: isLoadingApps } = useQuery({
    queryKey: ['student', 'applications'],
    queryFn: async () => {
      const res = await api.get('/applications/me');
      const data = res.data.data;
      return data.map((a: any) => ({
        ...a,
        opportunityTitle: a.opportunity?.title,
        companyName: a.opportunity?.organization?.name,
        companyLogo: a.opportunity?.organization?.logoUrl
      }));
    }
  });

  // Extract from query responses
  const student: StudentProfile | null = studentRes || null;
  const opportunities: Opportunity[] = opportunitiesRes || [];
  const applications: Application[] = applicationsRes || [];

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (updated: Partial<StudentProfile>) => {
      const res = await api.put('/students/me', updated);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] });
      showToast('Profile updated successfully', 'success');
    }
  });
  
  const onUpdateProfile = (updated: Partial<StudentProfile>) => {
    updateProfileMutation.mutate(updated);
  };

  // Filters & State for Opportunities
  const [oppSearch, setOppSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');

  // Selected Target Role for Skill Gap Analysis
  const [selectedTargetRole, setSelectedTargetRole] = useState<string>('Backend Engineer');

  // AI Roadmap State
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState<AIRoadmapResponse | null>(null);

  // AI Interview Questions State
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<AIInterviewQuestion[]>([]);

  // Resume Upload & AI Parser State
  const [resumeText, setResumeText] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [parseStatus, setParseStatus] = useState<string>('');

  // Loading and Error States
  if (isLoadingStudent) {
    return <div className="p-12 text-center text-slate-500">Loading student profile...</div>;
  }
  
  if (studentError || !student) {
    const status = (studentError as any)?.response?.status;
    const expiredSession = status === 401 || status === 403;
    if (status === 404) return <StudentOnboarding onComplete={() => { refetchStudent(); }} />;
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center px-4">
        <div className="glass-panel w-full rounded-3xl p-8 text-center sm:p-10">
          <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${expiredSession ? 'bg-amber-400/15 text-amber-300' : 'bg-cyan-400/15 text-cyan-300'}`}>
            {expiredSession ? <Clock className="h-6 w-6" /> : <FileCheck className="h-6 w-6" />}
          </div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">Student workspace</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white">{expiredSession ? 'Your session needs to be renewed' : 'Your career profile is not ready yet'}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">{expiredSession ? 'The sign-in link has expired or is no longer valid. Sign in again to securely load your student workspace.' : 'Your account is signed in, but it does not have a completed student profile yet. Start with your institution and academic details to unlock your career workspace.'}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {expiredSession ? <button onClick={() => signOut()} className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/40">Sign in again</button> : <button onClick={() => refetchStudent()} className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/40">Retry profile setup</button>}
            <a href="mailto:support@skillbridge.ai?subject=Student%20profile%20setup" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[.06]">Get help</a>
          </div>
        </div>
      </div>
    );
  }

  const profileChecklist = [student.branch, student.degree, student.graduationYear, student.resumeUrl, student.projects?.length, student.targetRoles?.length];
  const profileCompleteness = Math.round((profileChecklist.filter(Boolean).length / profileChecklist.length) * 100);
  const institutionVerified = student.skills.some(skill => skill.verified && Boolean((skill as any).verifiedBy));

  // Dynamically compute stats for H6 and H7
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW').length;
  // MatchScores calculates frontend if we want, but backend returns deterministic score on application.
  // We can calculate dynamically for browsing opportunities.
  const matchScores = opportunities.map(o => ({ opp: o, match: calculateOpportunityMatch(student, o) }));
  const topMatch = matchScores.sort((a, b) => b.match.overallScore - a.match.overallScore)[0];

  // Learning Program enrollments from profile state
  const enrolledPrograms = student.enrolledPrograms || {};

  const activeRoleObj = careerRoles.find(r => r.name === selectedTargetRole) || careerRoles[0];

  // Calculate skill gaps against active target role
  const roleGaps = React.useMemo(() => {
    return activeRoleObj ? activeRoleObj.requiredSkills.map(req => {
      const matched = student.skills.find(s => s.name.toLowerCase() === req.name.toLowerCase());
      const currentProf = matched ? matched.proficiency : 0;
      const gap = Math.max(0, req.minimumProficiency - currentProf);
      return {
        skillName: req.name,
        importance: req.importance,
        requiredProficiency: req.minimumProficiency,
        currentProficiency: currentProf,
        gap,
        level: matched ? matched.level : 'Beginner',
        verified: matched ? matched.verified : false
      };
    }) : [];
  }, [activeRoleObj, student.skills]);

  // Compute student readiness index
  const readinessIndex = React.useMemo(() => {
    const totalRequiredPoints = roleGaps.reduce((acc, g) => acc + g.requiredProficiency, 0);
    const totalAttainedPoints = roleGaps.reduce((acc, g) => acc + Math.min(g.currentProficiency, g.requiredProficiency), 0);
    return totalRequiredPoints > 0 ? Math.round((totalAttainedPoints / totalRequiredPoints) * 100) : 75;
  }, [roleGaps]);

  // Filter opportunities
  const filteredOpportunities = React.useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch =
        opp.title.toLowerCase().includes(oppSearch.toLowerCase()) ||
        opp.companyName.toLowerCase().includes(oppSearch.toLowerCase()) ||
        opp.requiredSkills.some(s => s.name.toLowerCase().includes(oppSearch.toLowerCase()));
      const matchesType = selectedType === 'all' || opp.type === selectedType;
      const matchesMode = selectedWorkMode === 'all' || opp.workMode === selectedWorkMode;
      return matchesSearch && matchesType && matchesMode;
    });
  }, [opportunities, oppSearch, selectedType, selectedWorkMode]);

  // Trigger AI Roadmap API
  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const currentSkills = student.skills.map(s => `${s.name} (${s.proficiency}%)`);
      const gaps = roleGaps.filter(g => g.gap > 0).map(g => `${g.skillName} (Needs +${g.gap}%)`);
      const roadmapData = await generateRoadmapWithGemini(currentSkills, selectedTargetRole, gaps);
      setAiRoadmap(roadmapData);
      showToast('AI Roadmap generated successfully!', 'success');
    } catch (e) {
      console.warn('Roadmap fetch error:', e);
      showToast('Failed to generate roadmap.', 'error');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Trigger AI Interview Prep
  const handleGenerateInterview = async () => {
    setIsGeneratingInterview(true);
    try {
      const skills = roleGaps.map(g => g.skillName);
      const prepData = await generateInterviewPrep(selectedTargetRole, skills);
      setInterviewQuestions(prepData);
      showToast('AI Interview Prep generated successfully!', 'success');
    } catch (e) {
      console.warn('Interview prep fetch error:', e);
      showToast('Failed to generate interview prep.', 'error');
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  // AI Resume Parse Handler
  const handleParseResume = async () => {
    if (!resumeText.trim()) return;
    setIsParsingResume(true);
    setParseStatus('Extracting competencies and education with Gemini AI...');
    try {
      const res = await fetch('/api/v1/ai/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });
      const json = await res.json();
      if (json.success) {
        setParsedData(json.data);
        setParseStatus('Extraction complete! Review extracted items below.');
      }
    } catch (e) {
      setParseStatus('Parsing fallback used.');
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleApplyExtractedSkills = () => {
    if (!parsedData?.skills) return;
    const newSkills: StudentSkill[] = [...student.skills];
    parsedData.skills.forEach((skillName: string) => {
      if (!newSkills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
        newSkills.push({
          skillId: `sk-imported-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: skillName,
          proficiency: 65,
          level: 'Intermediate',
          source: 'imported',
          verified: false
        });
      }
    });
    onUpdateProfile({ skills: newSkills });
    alert(`Imported ${parsedData.skills.length} skills from resume into your profile!`);
    setParsedData(null);
    setResumeText('');
    setParseStatus('');
  };

  const handleEnrollProgram = (progId: string) => {
    onUpdateProfile({
      enrolledPrograms: {
        ...enrolledPrograms,
        [progId]: enrolledPrograms[progId] !== undefined ? enrolledPrograms[progId] : 10
      }
    });
    showToast('Successfully enrolled in industry learning program! Track your modules below.');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'skills-gap', label: 'Skill Gaps & AI Roadmap', icon: <Target className="w-4 h-4" /> },
    { id: 'assessments', label: 'Capability Assessments', icon: <Award className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Explore Opportunities', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'applications', label: 'Applications Pipeline', icon: <Layers className="w-4 h-4" /> },
    { id: 'learning', label: 'Industry Learning', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Career Passport', icon: <FileCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-7">
      
      {/* Sub-navigation pill menu */}
      <aside className="mb-6 lg:mb-0">
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-[#0c1930]/80 p-2 shadow-xl shadow-slate-950/20 backdrop-blur-xl lg:sticky lg:top-24 lg:flex-col lg:items-stretch lg:overflow-visible">
        <p className="hidden px-3 pt-2 text-[10px] font-bold uppercase tracking-[.16em] text-slate-500 lg:block">Student workspace</p>
        {tabs.map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-student-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-950/40 font-bold'
                  : 'bg-transparent text-slate-300 hover:text-white hover:bg-white/[.08] border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="hidden mt-5 border-t border-white/10 px-3 pt-4 text-[11px] leading-relaxed text-slate-400 lg:block">Build evidence, close your gaps, then apply with a profile your institution has verified.</div>
      </aside>

      <section className="min-w-0 space-y-6">

      {/* TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Hero Student Banner */}
          <div className="p-6 rounded-3xl border border-cyan-300/15 bg-[radial-gradient(circle_at_85%_10%,rgba(37,99,235,.38),transparent_28rem),linear-gradient(120deg,#07152d,#111d50_55%,#091a33)] text-white shadow-2xl shadow-slate-950/30 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-200 border border-cyan-300/20 text-[11px] font-semibold uppercase tracking-wider">
                    Career command centre
                  </span>
                  <span className="text-xs text-slate-300">
                    Apex Institute of Technology (2026 Batch)
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1.5 font-display">
                  Good afternoon, {currentUser.name || 'Student'}.
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  Your career intelligence for today: <strong className="text-white">{student.skills.filter(s => s.verified).length} verified skills</strong>, <strong>{applications.length} active applications</strong>, and a <strong>{readinessIndex}% readiness signal</strong>.
                </p>
                <div className="mt-4 max-w-sm"><div className="mb-1.5 flex justify-between text-[11px] text-slate-300"><span>Profile completeness</span><span className="font-bold text-white">{profileCompleteness}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-indigo-400" style={{ width: `${profileCompleteness}%` }} /></div><p className={`mt-2 text-[11px] ${institutionVerified ? 'text-emerald-300' : 'text-amber-200'}`}>{institutionVerified ? 'Institution evidence verified — applications unlocked.' : 'Institution verification is required before applying.'}</p></div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  id="btn-overview-view-passport"
                  onClick={onOpenPassport}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-indigo-300" />
                  <span>View Career Passport</span>
                </button>
                <button
                  onClick={() => setActiveSubTab('portfolio')}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:brightness-110 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <span>Complete profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Role Readiness Index</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-slate-900 font-display">{readinessIndex}%</span>
                <span className="text-[11px] font-semibold text-emerald-600">+12% this month</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${readinessIndex}%` }}></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Verified Skills</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-slate-900 font-display">
                  {student.skills.filter(s => s.verified).length}
                </span>
                <span className="text-xs text-slate-500">of {student.skills.length} skills</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Backed by assessments & evidence</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Active Applications</span>
                <Briefcase className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-slate-900 font-display">{applications.length}</span>
                <span className="text-[11px] font-semibold text-sky-600">{shortlistedCount} Shortlisted</span>
              </div>
              <button
                onClick={() => setActiveSubTab('applications')}
                className="text-[11px] font-medium text-indigo-600 hover:underline mt-2 flex items-center gap-1"
              >
                <span>Track pipeline stages</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Top Opportunity Match</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-extrabold text-slate-900 font-display">{topMatch ? topMatch.match.overallScore : 0}%</span>
                <span className="text-xs text-slate-500">{topMatch ? topMatch.opp.companyName : 'N/A'}</span>
              </div>
              <button
                onClick={() => setActiveSubTab('opportunities')}
                className="text-[11px] font-medium text-indigo-600 hover:underline mt-2 flex items-center gap-1"
              >
                <span>Browse {opportunities.length} opportunities</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Core Recommended Loop: Assess -> Identify Gaps -> Learn -> Match -> Apply */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" />
                Actionable Career Loop: Next Steps for You
              </h3>
              <span className="text-[11px] text-indigo-600 font-medium">Personalized for {selectedTargetRole}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              <div className="p-3.5 bg-white rounded-xl border border-indigo-200/70 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                    Skill Gap Priority
                  </span>
                  <span className="text-[11px] font-bold text-amber-700">-18% Gap</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Docker & Container Orchestration</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your target role requires 70% proficiency in Docker. Current assessed score is 52%.
                </p>
                <button
                  onClick={() => setActiveSubTab('learning')}
                  className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  View Recommended Course →
                </button>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-indigo-200/70 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold uppercase">
                    Take Capability Test
                  </span>
                  <span className="text-[11px] text-slate-500">20 Mins</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Cloud Native & DevOps Assessment</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Verify your Kubernetes & Docker knowledge to raise your profile trust score.
                </p>
                <button
                  onClick={() => {
                    const targetAsmt = assessments.find(a => a.id === 'asmt-2') || assessments[0];
                    if (targetAsmt) onOpenAssessment(targetAsmt);
                  }}
                  className="w-full py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  Launch Assessment →
                </button>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-indigo-200/70 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    High Match Job
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">88% Match</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Novatech Backend Intern</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Strong overlap on Python, SQL, REST APIs. Applications closing soon.
                </p>
                <button
                  onClick={() => {
                    const opp = opportunities.length > 0 ? opportunities[0] : null;
                    if (opp) onOpenMatchDetails(opp, calculateOpportunityMatch(student, opp));
                  }}
                  className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  Explain Match & Apply →
                </button>
              </div>

            </div>
          </div>

          {/* Active Opportunities Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Top Matched Opportunities for You
              </h3>
              <button
                onClick={() => setActiveSubTab('opportunities')}
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>View all ({opportunities.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.slice(0, 2).map(opp => {
                const match = calculateOpportunityMatch(student, opp);
                return (
                  <div key={opp.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={opp.companyLogo} alt={opp.companyName} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">{opp.title}</h4>
                          <span className="text-xs text-slate-500">{opp.companyName} • {opp.location}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 border ${
                        match.overallScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {match.overallScore}% Match
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.map(s => {
                        const isMatched = match.matchedSkills.includes(s.name);
                        return (
                          <span
                            key={s.skillId}
                            className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                              isMatched ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {s.name}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-700">{opp.stipendOrSalary}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenMatchDetails(opp, match)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Explain Match
                        </button>
                        <button
                          onClick={() => onOpenApply(opp)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SKILL GAPS & AI ROADMAP */}
      {activeSubTab === 'skills-gap' && (
        <div className="space-y-6">
          
          {/* Target Role Selector Header */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Career Role Alignment
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5 font-display">
                Select Your Target Role:
              </h3>
              <p className="text-xs text-slate-500">
                System compares your assessed proficiencies against standardized industry requirements.
              </p>
            </div>

            <select
              value={selectedTargetRole}
              onChange={e => setSelectedTargetRole(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {careerRoles.map(r => (
                <option key={r.id} value={r.name}>
                  {r.name} ({r.marketDemand} Demand)
                </option>
              ))}
            </select>
          </div>

          {/* Skill Gaps Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Detailed Skill Requirements & Current Gaps */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    Capability Gap Analysis ({activeRoleObj?.name})
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Readiness: {readinessIndex}%
                  </span>
                </div>

                <div className="space-y-3.5">
                  {roleGaps.map(g => {
                    const isMet = g.gap === 0;
                    return (
                      <div key={g.skillName} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{g.skillName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase ${
                              g.importance === 'Mandatory' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {g.importance}
                            </span>
                            {g.verified && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-semibold">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <span className={`font-bold ${isMet ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {isMet ? 'Target Met' : `Needs +${g.gap}%`}
                          </span>
                        </div>

                        {/* Comparative Bar: Student vs Required */}
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>Your Level: <strong>{g.currentProficiency}%</strong></span>
                            <span>Target Level: <strong>{g.requiredProficiency}%</strong></span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden relative">
                            {/* Required Marker */}
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                              style={{ left: `${g.requiredProficiency}%` }}
                              title="Required Minimum"
                            />
                            {/* Student Progress */}
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isMet ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(100, g.currentProficiency)}%` }}
                            />
                          </div>
                        </div>

                        {!isMet && (
                          <div className="pt-1 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 italic">Recommended Action:</span>
                            <button
                              onClick={() => setActiveSubTab('learning')}
                              className="text-indigo-600 hover:underline font-semibold"
                            >
                              Explore Course for {g.skillName} →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: AI Personalized 30/60/90-Day Roadmap & Interview Prep */}
            <div className="space-y-4">
              
              {/* AI Roadmap Generator Box */}
              <div className="p-5 bg-gradient-to-br from-indigo-50 via-white to-sky-50 rounded-2xl border border-indigo-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      AI Personalized Roadmap
                    </h4>
                    <span className="text-[11px] text-slate-500">Powered by Gemini AI</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate a tailored 30/60/90-day learning and capstone project plan directly targeting your current skill gaps in {selectedTargetRole}.
                </p>

                <button
                  id="btn-generate-ai-roadmap"
                  disabled={isGeneratingRoadmap}
                  onClick={handleGenerateRoadmap}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingRoadmap ? 'Synthesizing Roadmap...' : 'Generate 30/60/90-Day Plan'}</span>
                </button>

                {/* Display Generated Roadmap */}
                {aiRoadmap && (
                  <div className="space-y-3 pt-3 border-t border-indigo-100 text-xs animate-in fade-in">
                    <div className="p-3 bg-white rounded-xl border border-indigo-200">
                      <span className="font-bold text-indigo-700 text-[11px] uppercase">Days 1 - 30: {aiRoadmap.day30?.theme}</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 text-[11px]">
                        {aiRoadmap.day30?.milestones?.map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[10px] font-semibold text-slate-700 bg-slate-50 p-1.5 rounded">
                        Action: {aiRoadmap.day30?.recommendedAction}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-indigo-200">
                      <span className="font-bold text-indigo-700 text-[11px] uppercase">Days 31 - 60: {aiRoadmap.day60?.theme}</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 text-[11px]">
                        {aiRoadmap.day60?.milestones?.map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-indigo-200">
                      <span className="font-bold text-indigo-700 text-[11px] uppercase">Days 61 - 90: {aiRoadmap.day90?.theme}</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 text-[11px]">
                        {aiRoadmap.day90?.milestones?.map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Interview Prep Generator */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    Interview Practice Mock
                  </h4>
                  <span className="text-[10px] text-slate-400">Target Role</span>
                </div>
                <p className="text-xs text-slate-500">
                  Generate scenario-based interview questions recruiters ask for this role.
                </p>
                <button
                  id="btn-generate-interview-questions"
                  disabled={isGeneratingInterview}
                  onClick={handleGenerateInterview}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isGeneratingInterview ? 'Generating...' : 'Get Role Practice Questions'}
                </button>

                {interviewQuestions.length > 0 && (
                  <div className="space-y-2 pt-2 text-xs">
                    {interviewQuestions.map((q, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="font-semibold text-slate-900">{i + 1}. {q.question}</div>
                        <div className="text-[11px] text-slate-500"><strong className="text-indigo-600">Hint:</strong> {q.hint}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 3: ASSESSMENTS */}
      {activeSubTab === 'assessments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Capability Assessment Question Banks
              </h3>
              <p className="text-xs text-slate-500">
                Normalized benchmark exams. Scoring ≥70% automatically updates your verified skill profile.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map(asmt => (
              <div key={asmt.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {asmt.capability}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {asmt.durationMinutes} mins
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-2.5 font-display">
                    {asmt.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {asmt.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">
                      Skills Benchmarked:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {asmt.skillsCovered.map(sk => (
                        <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">
                    {asmt.questionsCount} Standardized Questions
                  </span>
                  <button
                    id={`btn-start-asmt-${asmt.id}`}
                    onClick={() => onOpenAssessment(asmt)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXPLORE OPPORTUNITIES */}
      {activeSubTab === 'opportunities' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by job title, company name, or required skill..."
                  value={oppSearch}
                  onChange={e => setOppSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
                >
                  <option value="all">All Types</option>
                  <option value="internship">Internships</option>
                  <option value="job">Full-time Jobs</option>
                  <option value="live_project">Live Projects</option>
                  <option value="mentorship">Mentorships</option>
                </select>

                <select
                  value={selectedWorkMode}
                  onChange={e => setSelectedWorkMode(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
                >
                  <option value="all">All Modes</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* Opportunities List */}
          <div className="space-y-4">
            {filteredOpportunities.map(opp => {
              const match = calculateOpportunityMatch(student, opp);
              const alreadyApplied = applications.some(a => a.opportunityId === opp.id);

              return (
                <div
                  key={opp.id}
                  className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={opp.companyLogo}
                        alt={opp.companyName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {opp.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-500 font-medium capitalize">
                            • {opp.workMode}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1 font-display">
                          {opp.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-slate-700">{opp.companyName}</span>
                          <span>•</span>
                          <span>{opp.location}</span>
                          <span>•</span>
                          <span>{opp.duration}</span>
                        </p>
                      </div>
                    </div>

                    {/* Explainable Match Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`px-3 py-2 rounded-xl border text-center ${
                        match.overallScore >= 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}>
                        <div className="text-lg font-black font-display leading-tight">{match.overallScore}%</div>
                        <div className="text-[9px] uppercase font-bold tracking-wider">Match Score</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Skills tags with match highlight */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1">Skills:</span>
                    {opp.requiredSkills.map(sk => {
                      const isMatched = match.matchedSkills.includes(sk.name);
                      return (
                        <span
                          key={sk.skillId}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 ${
                            isMatched
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isMatched ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          <span>{sk.name}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="font-bold text-slate-900">{opp.stipendOrSalary}</span>
                      <span>•</span>
                      <span>Deadline: {opp.deadline}</span>
                      <span>•</span>
                      <span>{opp.openings} Openings</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenMatchDetails(opp, match)}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      >
                        Explain Match Breakdown
                      </button>
                      
                      {alreadyApplied ? (
                        <button
                          disabled
                          className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Applied</span>
                        </button>
                      ) : (
                        <button
                          id={`btn-apply-${opp.id}`}
                          onClick={() => onOpenApply(opp)}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 5: APPLICATION TRACKER PIPELINE */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Application Lifecycle Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Track status transitions, internal recruiter notes, and interview stages with immutable audit logs.
            </p>
          </div>

          <div className="space-y-4">
            {applications.map(app => {
              const stages: Application['status'][] = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];
              const isRejected = app.status === 'Rejected';
              const isWithdrawn = app.status === 'Withdrawn';
              const terminalStatus = isRejected || isWithdrawn;
              const displayIdx = terminalStatus 
                ? Math.max(0, ...app.events.map(e => stages.indexOf(e.status as any)))
                : stages.indexOf(app.status);

              return (
                <div key={app.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={app.companyLogo} alt={app.companyName} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{app.opportunityTitle}</h4>
                        <span className="text-xs text-slate-500">{app.companyName} • Applied on {app.appliedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isRejected ? 'bg-rose-50 text-rose-700 border-rose-200' : isWithdrawn ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                        Status: {app.status}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {app.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div className="relative py-2">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                    <div className="relative z-10 flex justify-between">
                      {stages.map((stage, idx) => {
                        const isDone = displayIdx >= idx;
                        const isCurrent = displayIdx === idx;
                        const isTerminalNode = terminalStatus && isCurrent;

                        return (
                          <div key={stage} className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isTerminalNode && isRejected
                                ? 'bg-rose-500 text-white ring-4 ring-rose-100 shadow-xs'
                                : isTerminalNode && isWithdrawn
                                ? 'bg-slate-500 text-white ring-4 ring-slate-100 shadow-xs'
                                : isCurrent && !terminalStatus
                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-xs'
                                : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white border-2 border-slate-300 text-slate-400'
                            }`}>
                              {isTerminalNode ? 'X' : (isDone && !isCurrent) ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[11px] font-semibold mt-1.5 ${
                              isTerminalNode && isRejected ? 'text-rose-700 font-bold'
                              : isTerminalNode && isWithdrawn ? 'text-slate-700 font-bold'
                              : isCurrent ? 'text-indigo-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                            }`}>
                              {isTerminalNode ? app.status : stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* History Timeline Events */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Audit Event History:
                    </h5>
                    <div className="space-y-2">
                      {app.events.map(evt => (
                        <div key={evt.id} className="text-xs flex items-start gap-2 text-slate-700">
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 mt-0.5">{evt.createdAt}</span>
                          <span className="font-semibold text-slate-900">• [{evt.status}]</span>
                          <span className="flex-1">{evt.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 6: INDUSTRY LEARNING PROGRAMS */}
      {activeSubTab === 'learning' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Industry Learning & Certification Programs
            </h3>
            <p className="text-xs text-slate-500">
              Directly aligned with missing skills. Earn verifiable credentials upon project completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPrograms.map(prog => {
              const currentProgress = enrolledPrograms[prog.id];
              const isEnrolled = currentProgress !== undefined;

              return (
                <div key={prog.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {prog.providerType} Certified
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {prog.durationWeeks} Weeks • {prog.mode}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-2 font-display">
                      {prog.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      By {prog.companyOrInstitution}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Target skills pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {prog.targetSkills.map(sk => (
                        <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Modules Checklist */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Syllabus Highlights:
                      </span>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {prog.syllabusModules.slice(0, 3).map((m, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Enrollment & Progress */}
                  <div className="pt-4 border-t border-slate-100">
                    {isEnrolled ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">Course Progress</span>
                          <span className="text-indigo-600 font-bold">{currentProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${currentProgress}%` }}></div>
                        </div>
                        {currentProgress >= 100 ? (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-1">
                            <CheckCircle2 className="w-4 h-4" /> Certificate Issued & Verified!
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              const updated = Math.min(100, currentProgress + 35);
                              onUpdateProfile({ enrolledPrograms: { ...enrolledPrograms, [prog.id]: updated } });
                            }}
                            className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors text-center"
                          >
                            Mark Next Module Completed (+35%)
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {prog.capacity - prog.enrolledCount} seats remaining
                        </span>
                        <button
                          onClick={() => handleEnrollProgram(prog.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                        >
                          Enroll for Free
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 7: CAREER PASSPORT & PORTFOLIO */}
      {activeSubTab === 'portfolio' && (
        <div className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Verifiable Credential Passport
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Digital Portfolio & Evidence Ledger
              </h3>
              <p className="text-xs text-slate-500">
                All skills, projects, and certificates are cryptographically linked and institution-verified.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-open-passport-modal"
                onClick={onOpenPassport}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Shareable Passport & QR Code</span>
              </button>
            </div>
          </div>

          {/* AI Resume Parser Tool Box */}
          <div className="p-5 bg-gradient-to-r from-indigo-50/70 via-white to-sky-50/70 rounded-2xl border border-indigo-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  AI-Assisted Resume Parser & Skill Importer
                </h4>
              </div>
              <span className="text-xs text-indigo-700 font-medium">Gemini 3.8 Flash Parser</span>
            </div>

            <p className="text-xs text-slate-600">
              Paste your raw resume text or markdown below. The engine will extract structured education, skills, and projects, mapping them to canonical SkillBridge taxonomies with a review screen.
            </p>

            <div className="space-y-2">
              <textarea
                rows={3}
                placeholder="Paste plain resume text here (e.g. Arjun Sharma, B.Tech CSE, Experience with Python, Postgres, Docker, Distributed Systems, Built caching engine...)"
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setResumeText(`Arjun Sharma
Apex Institute of Technology, B.Tech Computer Science 2026, CGPA: 8.85
Technical Skills: Python, Node.js, PostgreSQL, Docker, AWS, Distributed Systems, Git
Experience: Backend Engineering Intern at DataMesh Analytics (Summer 2025)
Projects: Built DistriCache in Go and Python; Campus Notification Portal in TypeScript`)}
                  className="text-[11px] text-indigo-600 hover:underline font-semibold"
                >
                  Load Sample Resume Text
                </button>
                <button
                  id="btn-parse-resume"
                  disabled={isParsingResume || !resumeText.trim()}
                  onClick={handleParseResume}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isParsingResume ? 'Parsing Resume...' : 'Parse with AI'}</span>
                </button>
              </div>
            </div>

            {parseStatus && (
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-800">
                {parseStatus}
              </div>
            )}

            {parsedData && (
              <div className="p-4 bg-white rounded-xl border border-indigo-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Extracted Capabilities to Review
                  </span>
                  <button
                    onClick={handleApplyExtractedSkills}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                  >
                    Confirm & Add to Profile
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parsedData.skills?.map((sk: string) => (
                    <span key={sk} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Verified Credentials */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Certifications & Verification Status
              </h4>

              <div className="space-y-2.5">
                {student.certifications.map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-slate-500">{c.issuer} • Issued {c.issueDate}</div>
                      {c.credentialId && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {c.credentialId}</div>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.verificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                    }`}>
                      {c.verificationStatus === 'verified' ? '✓ Campus Verified' : 'Pending Audit'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Featured Projects */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Featured Evidence Projects
              </h4>

              <div className="space-y-2.5">
                {student.projects.map(p => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{p.title}</span>
                      {p.githubRepo && (
                        <a href={p.githubRepo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                          <span>Repo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px]">{p.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.technologies.map(tech => (
                        <span key={tech} className="px-1.5 py-0.5 rounded-sm bg-white border border-slate-200 text-[10px] font-mono text-slate-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      </section>
    </div>
  );
};
