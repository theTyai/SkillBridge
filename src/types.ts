export type UserRole = 'student' | 'industry' | 'academician' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type OpportunityType = 'internship' | 'job' | 'live_project' | 'apprenticeship' | 'mentorship';

export type WorkMode = 'remote' | 'hybrid' | 'on-site';

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'Withdrawn' | 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | 'WITHDRAWN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  institutionId?: string;
  institutionName?: string;
  organizationId?: string;
  organizationName?: string;
  headline?: string;
  bio?: string;
  location?: string;
  profile?: {
    name?: string;
    avatarUrl?: string;
    designation?: string;
    portfolioSlug?: string;
  };
}

export interface CanonicalSkill {
  id: string;
  name: string;
  slug: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'Cloud & DevOps' | 'Data & AI' | 'Security' | 'Core CS' | 'Soft Skills';
  aliases: string[];
  description: string;
}

export interface StudentSkill {
  skillId: string;
  name: string;
  proficiency: number; // 0 - 100
  level: SkillLevel;
  source: 'assessed' | 'verified' | 'self-reported' | 'imported';
  assessedAt?: string;
  verified: boolean;
  evidenceUrl?: string;
}

export interface StudentProfile {
  userId: string;
  studentId: string;
  institutionId: string;
  institutionName: string;
  branch: string;
  degree: string;
  graduationYear: number;
  cgpa: number;
  bio: string;
  targetRoles: string[];
  skills: StudentSkill[];
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioSlug: string;
  isPublic: boolean;
  projects: StudentProject[];
  certifications: StudentCertification[];
  experiences: StudentExperience[];
  enrolledPrograms?: Record<string, number>;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubRepo?: string;
  liveDemo?: string;
  featured: boolean;
}

export interface StudentCertification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface StudentExperience {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'part-time' | 'full-time' | 'research';
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface CareerRole {
  id: string;
  name: string;
  category: string;
  description: string;
  averageSalary: string;
  marketDemand: 'Very High' | 'High' | 'Moderate';
  requiredSkills: {
    skillId: string;
    name: string;
    minimumLevel: SkillLevel;
    minimumProficiency: number;
    weight: number; // 0 - 1
    importance: 'Mandatory' | 'High' | 'Nice-to-have';
  }[];
}

export interface Opportunity {
  id: string;
  industryId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  roleId: string;
  type: OpportunityType;
  description: string;
  location: string;
  workMode: WorkMode;
  stipendOrSalary: string;
  duration: string;
  deadline: string;
  openings: number;
  status: 'draft' | 'pending_approval' | 'published' | 'closed';
  requiredSkills: {
    skillId: string;
    name: string;
    requiredLevel: SkillLevel;
    requiredProficiency: number;
    required: boolean;
  }[];
  preferredSkills: string[];
  eligibility: {
    minCgpa?: number;
    allowedBranches: string[];
    allowedGradYears: number[];
  };
  applicationQuestions?: string[];
  createdAt: string;
  applicantsCount: number;
}

export interface MatchScoreExplanation {
  overallScore: number; // 0 - 100
  requiredSkillScore: number; // 0 - 100
  proficiencyFitScore: number; // 0 - 100
  preferredSkillScore: number; // 0 - 100
  roleInterestScore: number; // 0 - 100
  workModeScore: number; // 0 - 100
  profileCompletenessScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: {
    skill: string;
    currentProficiency: number;
    requiredProficiency: number;
    gap: number;
  }[];
  isEligible: boolean;
  eligibilityNotes: string[];
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  companyLogo: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentBranch: string;
  studentCgpa: number;
  studentAvatar: string;
  status: ApplicationStatus;
  appliedAt: string;
  resumeUrl: string;
  coverNote?: string;
  matchScore: number;
  events: {
    id: string;
    status: ApplicationStatus;
    note: string;
    createdAt: string;
    createdBy: string;
  }[];
  internalNotes?: string;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  skillId: string;
  skillName: string;
  type: 'mcq' | 'scenario' | 'rating';
  options?: {
    id: string;
    text: string;
    isCorrect?: boolean;
    points: number; // 0 - 100
  }[];
  scenarioCode?: string;
  explanation?: string;
}

export interface Assessment {
  id: string;
  title: string;
  category: string;
  capability: string;
  durationMinutes: number;
  description: string;
  questionsCount: number;
  skillsCovered: string[];
  questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  studentId: string;
  score: number; // 0 - 100
  passed: boolean;
  startedAt: string;
  completedAt: string;
  skillBreakdown: {
    skillId: string;
    skillName: string;
    score: number;
  }[];
}

export interface LearningProgram {
  id: string;
  companyOrInstitution: string;
  providerType: 'Industry' | 'Institution';
  title: string;
  description: string;
  targetSkills: string[];
  durationWeeks: number;
  mode: 'Online Self-paced' | 'Instructor-led' | 'Hybrid Bootcamp';
  level: SkillLevel;
  deadline: string;
  capacity: number;
  enrolledCount: number;
  syllabusModules: string[];
  certificateProvided: boolean;
}

export interface LearningEnrollment {
  id: string;
  programId: string;
  studentId: string;
  enrolledAt: string;
  progress: number; // 0 - 100
  completed: boolean;
  completedAt?: string;
  certificateId?: string;
}

export interface FacultyProfile {
  userId: string;
  institutionId: string;
  department: string;
  designation: string;
  expertise: string[];
  bio: string;
  publicationsCount: number;
  consultancyOpen: boolean;
  mentorshipSlots: number;
}

export interface FacultyOpportunity {
  id: string;
  type: 'Faculty Internship' | 'Industrial Training' | 'FDP' | 'Consultancy' | 'Research Collaboration';
  title: string;
  companyName: string;
  description: string;
  stipendOrGrant?: string;
  duration: string;
  location: string;
  deadline: string;
  domain: string;
  status: 'Open' | 'Under Review' | 'Filled';
}

export interface CollaborationProject {
  id: string;
  title: string;
  type: 'Live Project' | 'Industry Research' | 'Innovation Hackathon' | 'Guest Lecture Series';
  industryPartner: string;
  institutionPartner: string;
  description: string;
  status: 'Planning' | 'Active' | 'Under Review' | 'Completed';
  participantsCount: number;
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
  messagesCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'opportunity' | 'application' | 'assessment' | 'verification' | 'mentorship' | 'collaboration';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface InstitutionAnalytics {
  totalStudents: number;
  verifiedStudents: number;
  totalFaculty: number;
  partnerCompanies: number;
  activeOpportunities: number;
  totalApplications: number;
  activeInternships: number;
  placementsCount: number;
  placementRate: number;
  averageStipend: string;
  topSkillGaps: {
    skill: string;
    demandPercent: number;
    studentCoveragePercent: number;
    gapScore: number;
  }[];
  departmentBreakdown: {
    department: string;
    studentsCount: number;
    placedCount: number;
    avgReadiness: number;
  }[];
  skillDemandTrends: {
    skill: string;
    category: string;
    growthPercent: number;
    openingsCount: number;
  }[];
}
