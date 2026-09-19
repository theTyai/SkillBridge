import React, { useState } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  Opportunity,
  Application,
  Assessment,
  LearningProgram,
  CollaborationProject,
  FacultyOpportunity,
  CanonicalSkill,
  InstitutionAnalytics,
  NotificationItem,
  MatchScoreExplanation,
  StudentSkill,
  ApplicationStatus,
  SkillLevel
} from './types';
import {
  demoUsers,
  initialStudentProfile,
  initialOpportunities,
  initialApplications,
  initialAssessments,
  initialLearningPrograms,
  initialCollaborationProjects,
  initialFacultyOpportunities,
  initialCanonicalSkills,
  initialInstitutionAnalytics,
  initialCareerRoles,
  initialNotifications
} from './data/seedData';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { IndustryDashboard } from './components/IndustryDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { InstitutionDashboard } from './components/InstitutionDashboard';
import { ToastProvider, showToast } from './components/Toast';
import { MatchExplanationModal } from './components/MatchExplanationModal';
import { AssessmentRunnerModal } from './components/AssessmentRunnerModal';
import { PublicPortfolioModal } from './components/PublicPortfolioModal';
import { NotificationModal } from './components/NotificationModal';
import { ApplyModal } from './components/ApplyModal';
import { ConfirmModal } from './components/ConfirmModal';

import { useAuth } from './context/AuthContext';
import { usePersistentState } from './hooks/usePersistentState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './lib/api';

export default function App() {
  const { currentUser, loading } = useAuth();
  const queryClient = useQueryClient();
  
  // Master domain states (Persisted to localStorage)
  const SESSION_VER = '1.0';
  const [studentProfile, setStudentProfile] = usePersistentState<StudentProfile>('sb_studentProfile', initialStudentProfile, SESSION_VER);
  const [opportunities, setOpportunities] = usePersistentState<Opportunity[]>('sb_opportunities', initialOpportunities, SESSION_VER);
  const [applications, setApplications] = usePersistentState<Application[]>('sb_applications', initialApplications, SESSION_VER);
  const [assessments, setAssessments] = usePersistentState<Assessment[]>('sb_assessments', initialAssessments, SESSION_VER);
  const [learningPrograms, setLearningPrograms] = usePersistentState<LearningProgram[]>('sb_learningPrograms', initialLearningPrograms, SESSION_VER);
  const [collaborationProjects, setCollaborationProjects] = usePersistentState<CollaborationProject[]>('sb_collaborationProjects', initialCollaborationProjects, SESSION_VER);
  const [facultyOpportunities, setFacultyOpportunities] = usePersistentState<FacultyOpportunity[]>('sb_facultyOpportunities', initialFacultyOpportunities, SESSION_VER);
  const [canonicalSkills, setCanonicalSkills] = usePersistentState<CanonicalSkill[]>('sb_canonicalSkills', initialCanonicalSkills, SESSION_VER);
  const [institutionAnalytics, setInstitutionAnalytics] = usePersistentState<InstitutionAnalytics>('sb_institutionAnalytics', initialInstitutionAnalytics, SESSION_VER);
  const [notifications, setNotifications] = usePersistentState<NotificationItem[]>('sb_notifications', initialNotifications, SESSION_VER);

  // Student active sub-tab
  const [studentSubTab, setStudentSubTab] = useState<string>('overview');

  // Modal States
  const [selectedAssessmentForRunner, setSelectedAssessmentForRunner] = useState<Assessment | null>(null);
  const [matchDetails, setMatchDetails] = useState<{
    opp: Opportunity;
    explanation: MatchScoreExplanation;
  } | null>(null);
  const [oppToApply, setOppToApply] = useState<Opportunity | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Student Profile updates
  const handleUpdateStudentProfile = (updated: Partial<StudentProfile>) => {
    setStudentProfile(prev => ({
      ...prev,
      ...updated
    }));
  };

  // Assessment Completed Handler
  const handleAssessmentComplete = (
    asmt: Assessment,
    score: number,
    updatedSkillsList: Partial<StudentSkill>[]
  ) => {
    const passed = score >= 70;

    // 1. Update matching skills in student profile
    const updatedSkills = studentProfile.skills.map(sk => {
      const match = updatedSkillsList.find(us => us.skillId === sk.skillId);
      if (match) {
        return {
          ...sk,
          proficiency: Math.max(sk.proficiency, match.proficiency || score),
          verified: passed ? true : sk.verified,
          level: (score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner') as SkillLevel
        };
      }
      if (asmt.skillsCovered.some(sc => sc.toLowerCase() === sk.name.toLowerCase())) {
        return {
          ...sk,
          proficiency: Math.max(sk.proficiency, score),
          verified: passed ? true : sk.verified,
          level: (score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner') as SkillLevel
        };
      }
      return sk;
    });

    // 2. If passed, add to verified certifications
    const newCerts = [...studentProfile.certifications];
    if (passed) {
      newCerts.push({
        id: `cert-asmt-${Date.now()}`,
        title: `SkillBridge Certified: ${asmt.capability}`,
        issuer: 'Apex Academic & Skill Council',
        issueDate: new Date().toISOString().split('T')[0],
        credentialId: `SB-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`,
        verificationStatus: 'pending'
      });
    }

    setStudentProfile(prev => ({
      ...prev,
      skills: updatedSkills,
      certifications: newCerts
    }));

    // 3. Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: passed ? `Assessment Passed: ${asmt.capability}` : `Assessment Completed`,
      message: passed
        ? `Congratulations! You scored ${score}% and verified your competencies in ${asmt.skillsCovered.join(', ')}.`
        : `You scored ${score}%. Review your skill gap breakdown and try again in 7 days.`,
      type: 'assessment',
      read: false,
      createdAt: new Date().toISOString(),
      link: 'assessments'
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handle new job / opportunity post from Recruiter
  const handleCreateOpportunity = (newOpp: Partial<Opportunity>) => {
    const opp: Opportunity = {
      id: `opp-${Date.now()}`,
      industryId: newOpp.industryId || 'org-novatech',
      companyName: newOpp.companyName || 'Novatech Systems',
      companyLogo: newOpp.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      title: newOpp.title || 'Untitled Opportunity',
      roleId: newOpp.roleId || 'role-backend',
      type: newOpp.type || 'internship',
      description: newOpp.description || '',
      location: newOpp.location || 'Bangalore, India',
      workMode: newOpp.workMode || 'hybrid',
      stipendOrSalary: newOpp.stipendOrSalary || 'Competitive',
      duration: newOpp.duration || '6 Months',
      deadline: newOpp.deadline || '2026-05-30',
      openings: newOpp.openings || 3,
      status: 'published',
      requiredSkills: newOpp.requiredSkills || [],
      preferredSkills: newOpp.preferredSkills || [],
      eligibility: newOpp.eligibility || { minCgpa: 7.0, allowedBranches: ['Computer Science & Engineering'], allowedGradYears: [2026] },
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOpportunities(prev => [opp, ...prev]);

    // Add alert notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: 'usr-student-1',
        title: `New Campus Opportunity: ${opp.title}`,
        message: `${opp.companyName} just posted a new ${opp.type} matching your academic criteria.`,
        type: 'opportunity',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Handle application submission
  const applyMutation = useMutation({
    mutationFn: async (newApp: Partial<Application>) => {
      const res = await api.post(`/applications`, {
        opportunityId: newApp.opportunityId,
        coverNote: newApp.coverNote,
        resumeUrl: newApp.resumeUrl
      });
      return res.data.data;
    },
    onSuccess: () => {
      showToast('Application successfully submitted!', 'success');
      // Force refresh of applications and opportunities
      queryClient.invalidateQueries({ queryKey: ['student', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
    onError: (err: any) => {
      showToast(err.response?.data?.error || 'Failed to submit application', 'error');
    }
  });

  const handleSubmitApplication = (newApp: Partial<Application>) => {
    applyMutation.mutate(newApp);
    setOppToApply(null);
  };

  // Canonical skill creation
  const handleAddCanonicalSkill = (skill: CanonicalSkill) => {
    setCanonicalSkills(prev => [...prev, skill]);
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Reset demo data helper
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleResetData = () => {
    setStudentProfile(initialStudentProfile);
    setOpportunities(initialOpportunities);
    setApplications(initialApplications);
    setAssessments(initialAssessments);
    setNotifications(initialNotifications);
    showToast('SkillBridge demo data has been reset to default state.', 'success');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading SkillBridge...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <ToastProvider />
      
      {/* Platform Navigation Bar with multi-role switcher */}
      <Navbar
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onResetData={() => setIsResetModalOpen(true)}
        activeTab={studentSubTab}
        setActiveTab={setStudentSubTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Welcome to SkillBridge</h2>
            <p className="text-slate-500 mt-2 max-w-md">Please use the "Role Mode" switcher in the top navigation bar to select a persona and log in to explore the platform.</p>
          </div>
        ) : (
          <>
            {currentUser.role === 'STUDENT' && (
              <StudentDashboard
                currentUser={currentUser as any}
                assessments={assessments}
                learningPrograms={learningPrograms}
                careerRoles={initialCareerRoles}
                onOpenAssessment={asmt => setSelectedAssessmentForRunner(asmt)}
                onOpenMatchDetails={(opp, exp) => setMatchDetails({ opp, explanation: exp })}
                onOpenApply={opp => setOppToApply(opp)}
                onOpenPassport={() => setIsPassportOpen(true)}
                activeSubTab={studentSubTab}
                setActiveSubTab={setStudentSubTab}
              />
            )}

            {currentUser.role === 'INDUSTRY' && (
              <IndustryDashboard
                currentUser={currentUser as any}
                learningPrograms={learningPrograms}
                collaborationProjects={collaborationProjects}
                canonicalSkills={canonicalSkills}
              />
            )}

            {currentUser.role === 'ACADEMICIAN' && (
              <FacultyDashboard
                currentUser={currentUser as any}
                facultyOpportunities={facultyOpportunities}
                collaborationProjects={collaborationProjects}
              />
            )}

            {currentUser.role === 'ADMIN' && (
              <InstitutionDashboard
                analytics={institutionAnalytics}
                canonicalSkills={canonicalSkills}
                currentUser={currentUser as any}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-display">SkillBridge AI</span>
            <span>• Career Intelligence & Academia–Industry Collaboration Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Apex Institute of Technology</span>
            <span>•</span>
            <span>Novatech Systems</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">Explainable AI Core v2.4</span>
          </div>
        </div>
      </footer>

      {/* MODAL: Explainable Match Score Breakdown */}
      {matchDetails && (
        <MatchExplanationModal
          opportunity={matchDetails.opp}
          matchExplanation={matchDetails.explanation}
          onClose={() => setMatchDetails(null)}
          onApply={() => {
            setOppToApply(matchDetails.opp);
            setMatchDetails(null);
          }}
        />
      )}

      {/* MODAL: Capability Assessment Interactive Runner */}
      {selectedAssessmentForRunner && (
        <AssessmentRunnerModal
          assessment={selectedAssessmentForRunner}
          onClose={() => setSelectedAssessmentForRunner(null)}
          onComplete={(score, updatedSkills) => {
            handleAssessmentComplete(selectedAssessmentForRunner, score, updatedSkills);
            setSelectedAssessmentForRunner(null);
          }}
        />
      )}

      {/* MODAL: Apply to Opportunity */}
      <ApplyModal
        opportunity={oppToApply}
        student={studentProfile}
        onClose={() => setOppToApply(null)}
        onSubmitApplication={handleSubmitApplication}
      />

      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Demo Data"
        message="Are you sure you want to reset the platform to its default seed data? This will wipe all changes, applications, and created content."
        confirmLabel="Yes, Reset Data"
        onConfirm={handleResetData}
        onCancel={() => setIsResetModalOpen(false)}
      />

      {/* MODAL: Living Career Passport & QR Code */}
      {isPassportOpen && (
        <PublicPortfolioModal
          student={studentProfile}
          onClose={() => setIsPassportOpen(false)}
          onTogglePrivacy={isPub => setStudentProfile(prev => ({ ...prev, isPublic: isPub }))}
        />
      )}

      {/* MODAL: System Notifications Center */}
      {isNotificationsOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllRead}
          onNavigate={tab => {
            setStudentSubTab(tab);
            setIsNotificationsOpen(false);
          }}
        />
      )}

    </div>
  );
}
