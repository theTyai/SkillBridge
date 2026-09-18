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
  ApplicationStatus
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
import { MatchExplanationModal } from './components/MatchExplanationModal';
import { AssessmentRunnerModal } from './components/AssessmentRunnerModal';
import { PublicPortfolioModal } from './components/PublicPortfolioModal';
import { NotificationModal } from './components/NotificationModal';
import { ApplyModal } from './components/ApplyModal';

export default function App() {
  // Current active user / persona
  const [currentUser, setCurrentUser] = useState<User>(demoUsers[0]);

  // Master domain states
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(initialStudentProfile);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [learningPrograms, setLearningPrograms] = useState<LearningProgram[]>(initialLearningPrograms);
  const [collaborationProjects, setCollaborationProjects] = useState<CollaborationProject[]>(initialCollaborationProjects);
  const [facultyOpportunities, setFacultyOpportunities] = useState<FacultyOpportunity[]>(initialFacultyOpportunities);
  const [canonicalSkills, setCanonicalSkills] = useState<CanonicalSkill[]>(initialCanonicalSkills);
  const [institutionAnalytics, setInstitutionAnalytics] = useState<InstitutionAnalytics>(initialInstitutionAnalytics);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

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

  // User role switch handler
  const handleRoleSwitch = (role: UserRole) => {
    const user = demoUsers.find(u => u.role === role) || demoUsers[0];
    setCurrentUser(user);
  };

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
          level: (score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner') as any
        };
      }
      if (asmt.skillsCovered.some(sc => sc.toLowerCase() === sk.name.toLowerCase())) {
        return {
          ...sk,
          proficiency: Math.max(sk.proficiency, score),
          verified: passed ? true : sk.verified,
          level: (score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner') as any
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
        verificationStatus: 'verified'
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
  const handleSubmitApplication = (newApp: Partial<Application>) => {
    const app: Application = {
      id: newApp.id || `app-${Date.now()}`,
      opportunityId: newApp.opportunityId || '',
      opportunityTitle: newApp.opportunityTitle || '',
      companyName: newApp.companyName || '',
      companyLogo: newApp.companyLogo || '',
      studentId: newApp.studentId || currentUser.id,
      studentName: newApp.studentName || currentUser.name,
      studentEmail: newApp.studentEmail || currentUser.email,
      studentBranch: newApp.studentBranch || studentProfile.branch,
      studentCgpa: newApp.studentCgpa || studentProfile.cgpa,
      studentAvatar: newApp.studentAvatar || currentUser.avatarUrl,
      status: 'Applied',
      appliedAt: newApp.appliedAt || new Date().toISOString().split('T')[0],
      resumeUrl: newApp.resumeUrl || '',
      coverNote: newApp.coverNote || '',
      matchScore: newApp.matchScore || 85,
      events: newApp.events || [
        {
          id: `evt-${Date.now()}`,
          status: 'Applied',
          note: 'Application transmitted via campus portal.',
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: currentUser.name
        }
      ]
    };

    setApplications(prev => [app, ...prev]);

    // Update applicant count in opportunity
    setOpportunities(prev =>
      prev.map(o => (o.id === app.opportunityId ? { ...o, applicantsCount: o.applicantsCount + 1 } : o))
    );

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: 'usr-industry-1',
        title: `New Candidate: ${app.studentName}`,
        message: `${app.studentName} applied for ${app.opportunityTitle} with an assessed ${app.matchScore}% compatibility score.`,
        type: 'application',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Handle status update by Recruiter
  const handleUpdateApplicationStatus = (appId: string, status: ApplicationStatus, note: string) => {
    setApplications(prev =>
      prev.map(a => {
        if (a.id === appId) {
          return {
            ...a,
            status,
            events: [
              ...a.events,
              {
                id: `evt-${Date.now()}`,
                status,
                note,
                createdAt: new Date().toLocaleDateString(),
                createdBy: currentUser.name
              }
            ]
          };
        }
        return a;
      })
    );

    // Notify student
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: 'usr-student-1',
        title: `Application Update: ${status}`,
        message: `${currentUser.organizationName || 'Recruiter'} has moved your application status to "${status}". Note: "${note}"`,
        type: 'application',
        read: false,
        createdAt: new Date().toISOString(),
        link: 'applications'
      },
      ...prev
    ]);
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
  const handleResetData = () => {
    setStudentProfile(initialStudentProfile);
    setOpportunities(initialOpportunities);
    setApplications(initialApplications);
    setAssessments(initialAssessments);
    setNotifications(initialNotifications);
    alert('SkillBridge demo data has been reset to default state.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Platform Navigation Bar with multi-role switcher */}
      <Navbar
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onResetData={handleResetData}
        activeTab={studentSubTab}
        setActiveTab={setStudentSubTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Render Dashboard based on current persona */}
        {currentUser.role === 'student' && (
          <StudentDashboard
            student={studentProfile}
            opportunities={opportunities}
            applications={applications}
            assessments={assessments}
            learningPrograms={learningPrograms}
            careerRoles={initialCareerRoles}
            onOpenAssessment={asmt => setSelectedAssessmentForRunner(asmt)}
            onOpenMatchDetails={(opp, exp) => setMatchDetails({ opp, explanation: exp })}
            onOpenApply={opp => setOppToApply(opp)}
            onOpenPassport={() => setIsPassportOpen(true)}
            onUpdateProfile={handleUpdateStudentProfile}
            activeSubTab={studentSubTab}
            setActiveSubTab={setStudentSubTab}
          />
        )}

        {currentUser.role === 'industry' && (
          <IndustryDashboard
            currentUser={currentUser}
            opportunities={opportunities}
            applications={applications}
            learningPrograms={learningPrograms}
            collaborationProjects={collaborationProjects}
            canonicalSkills={canonicalSkills}
            onCreateOpportunity={handleCreateOpportunity}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
          />
        )}

        {currentUser.role === 'academician' && (
          <FacultyDashboard
            currentUser={currentUser}
            facultyOpportunities={facultyOpportunities}
            collaborationProjects={collaborationProjects}
          />
        )}

        {currentUser.role === 'admin' && (
          <InstitutionDashboard
            analytics={institutionAnalytics}
            canonicalSkills={canonicalSkills}
            currentUser={currentUser}
            onAddSkill={handleAddCanonicalSkill}
          />
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
