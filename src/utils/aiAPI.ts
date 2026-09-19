import { StudentProfile } from '../types';

export interface AIRoadmapPhase {
  theme: string;
  milestones: string[];
  recommendedAction?: string;
}

export interface AIRoadmapResponse {
  day30: AIRoadmapPhase;
  day60: AIRoadmapPhase;
  day90: AIRoadmapPhase;
}

export interface AIInterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
  hint: string;
}

export const generateRoadmapWithGemini = async (
  currentSkills: string[],
  targetRole: string,
  gaps: string[]
): Promise<AIRoadmapResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        day30: {
          theme: 'Foundation & Core Gaps',
          milestones: [
            `Master the basics of ${gaps[0] || 'your core missing skills'}`,
            'Complete online certification module for primary framework',
            'Set up local development environment and build a hello-world project'
          ],
          recommendedAction: 'Start with the introductory capstone in your Learning tab.'
        },
        day60: {
          theme: 'Intermediate Concepts & Integration',
          milestones: [
            `Apply ${gaps[1] || 'advanced concepts'} to a live system`,
            'Contribute to a team or open source repository',
            'Take a mid-level capability assessment to verify progress'
          ]
        },
        day90: {
          theme: 'Advanced Mastery & Interview Prep',
          milestones: [
            'Build an end-to-end full-stack or architecture project',
            'Simulate technical interview questions for the role',
            'Apply to targeted opportunities on the platform'
          ]
        }
      });
    }, 2000); // Mock 2 seconds delay
  });
};

export const generateInterviewPrep = async (
  roleName: string,
  skills: string[]
): Promise<AIInterviewQuestion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        skills.slice(0, 5).map((skill, idx) => ({
          question: `Can you explain a complex scenario where you applied ${skill}?`,
          category: skill,
          difficulty: idx % 2 === 0 ? 'Advanced' : 'Intermediate',
          hint: 'Focus on the STAR method. Discuss trade-offs and your specific contributions.'
        }))
      );
    }, 2000);
  });
};
