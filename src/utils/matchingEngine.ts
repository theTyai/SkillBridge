import { StudentProfile, Opportunity, MatchScoreExplanation } from '../types';

export function calculateOpportunityMatch(
  student: StudentProfile,
  opportunity: Opportunity
): MatchScoreExplanation {
  const studentSkillMap = new Map(
    student.skills.map(s => [s.skillId.toLowerCase(), s])
  );
  // Also index by name lowercase
  const studentSkillNameMap = new Map(
    student.skills.map(s => [s.name.toLowerCase(), s])
  );

  const matchedSkills: string[] = [];
  const missingSkills: {
    skill: string;
    currentProficiency: number;
    requiredProficiency: number;
    gap: number;
  }[] = [];

  let requiredScoreSum = 0;
  let proficiencyFitSum = 0;
  const totalRequired = opportunity.requiredSkills.length || 1;

  for (const req of opportunity.requiredSkills) {
    const studentSkill = studentSkillMap.get(req.skillId.toLowerCase()) || 
      studentSkillNameMap.get(req.name.toLowerCase());

    if (studentSkill) {
      matchedSkills.push(req.name);
      requiredScoreSum += 1;

      // Check proficiency fit
      const diff = studentSkill.proficiency - req.requiredProficiency;
      if (diff >= 0) {
        proficiencyFitSum += 1; // Meets or exceeds
      } else {
        const partialFit = Math.max(0, studentSkill.proficiency / req.requiredProficiency);
        proficiencyFitSum += partialFit;
        missingSkills.push({
          skill: req.name,
          currentProficiency: studentSkill.proficiency,
          requiredProficiency: req.requiredProficiency,
          gap: Math.abs(diff)
        });
      }
    } else {
      missingSkills.push({
        skill: req.name,
        currentProficiency: 0,
        requiredProficiency: req.requiredProficiency,
        gap: req.requiredProficiency
      });
    }
  }

  const requiredSkillScore = Math.round((requiredScoreSum / totalRequired) * 100);
  const proficiencyFitScore = Math.round((proficiencyFitSum / totalRequired) * 100);

  // Preferred skills match - Optimized
  let preferredMatched = 0;
  if (opportunity.preferredSkills.length > 0) {
    const validStudentSkills = student.skills
      .map(s => s.name.toLowerCase().trim())
      .filter(name => name.length > 0); // avoid empty string matching everything

    for (const pref of opportunity.preferredSkills) {
      const prefLower = pref.toLowerCase().trim();
      if (!prefLower) continue;
      
      if (validStudentSkills.some(sName => sName.includes(prefLower) || prefLower.includes(sName))) {
        preferredMatched++;
      }
    }
  }
  const preferredSkillScore = opportunity.preferredSkills.length > 0
    ? Math.round((preferredMatched / opportunity.preferredSkills.length) * 100)
    : 80;

  // Role interest match - Optimized
  const targetRolesLower = student.targetRoles
    .map(r => r.toLowerCase().trim())
    .filter(r => r.length > 0);
  
  const oppTitleLower = opportunity.title.toLowerCase();
  const oppRoleLower = opportunity.roleId.replace('role-', '').toLowerCase();

  const roleMatches = targetRolesLower.some(r => 
    oppTitleLower.includes(r) || r.includes(oppRoleLower)
  );
  const roleInterestScore = roleMatches ? 100 : 60;

  // Work mode score (generous for remote/hybrid)
  const workModeScore = opportunity.workMode === 'remote' ? 100 : (opportunity.workMode === 'hybrid' ? 90 : 75);

  // Profile completeness score
  let completeness = 50;
  if (student.resumeUrl) completeness += 15;
  if (student.githubUrl) completeness += 15;
  if (student.projects.length >= 2) completeness += 10;
  if (student.certifications.length >= 1) completeness += 10;
  const profileCompletenessScore = Math.min(100, completeness);

  // Eligibility evaluation
  const eligibilityNotes: string[] = [];
  let isEligible = true;

  if (opportunity.eligibility.minCgpa && student.cgpa < opportunity.eligibility.minCgpa) {
    isEligible = false;
    eligibilityNotes.push(`CGPA requirement: Minimum ${opportunity.eligibility.minCgpa} required (Current: ${student.cgpa})`);
  }

  if (
    opportunity.eligibility.allowedBranches &&
    opportunity.eligibility.allowedBranches.length > 0 &&
    !opportunity.eligibility.allowedBranches.some(b => b.toLowerCase() === student.branch.toLowerCase())
  ) {
    isEligible = false;
    eligibilityNotes.push(`Eligible branches: ${opportunity.eligibility.allowedBranches.join(', ')}`);
  }

  if (
    opportunity.eligibility.allowedGradYears &&
    opportunity.eligibility.allowedGradYears.length > 0 &&
    !opportunity.eligibility.allowedGradYears.includes(student.graduationYear)
  ) {
    isEligible = false;
    eligibilityNotes.push(`Eligible graduation batches: ${opportunity.eligibility.allowedGradYears.join(', ')}`);
  }

  // Weight formula:
  // Compatibility = 0.55 × required-skill score + 0.15 × proficiency score + 0.10 × preferred-skill score + 0.10 × role-interest score + 0.05 × work-mode/location score + 0.05 × profile completeness
  let rawScore = Math.round(
    0.55 * requiredSkillScore +
    0.15 * proficiencyFitScore +
    0.10 * preferredSkillScore +
    0.10 * roleInterestScore +
    0.05 * workModeScore +
    0.05 * profileCompletenessScore
  );

  // If hard eligibility fails, cap overall score so it is transparent
  if (!isEligible) {
    rawScore = Math.min(rawScore, 48);
  }

  return {
    overallScore: Math.min(99, Math.max(15, rawScore)),
    requiredSkillScore,
    proficiencyFitScore,
    preferredSkillScore,
    roleInterestScore,
    workModeScore,
    profileCompletenessScore,
    matchedSkills,
    missingSkills,
    isEligible,
    eligibilityNotes
  };
}
