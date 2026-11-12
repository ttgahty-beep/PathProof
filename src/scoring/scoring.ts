/**
 * PathProof Phase 1 — Deterministic Scoring Engine
 * Implements SRS Section 5, Business Rules BR-03 to BR-11, and Test Plan Fixtures.
 */

import {
  CareerSkill,
  CareerSubject,
  CareerInterestTag,
  StudentSubject,
  StudentSkill,
  StudentPreference,
  ProficiencyLevel,
  SkillGapStatus,
  SkillGapItem,
  SkillGapAnalysis,
  Skill,
} from '../types/index.ts';

export interface DimensionScoreResult {
  score: number | null; // 0-100 or null if NOT_ENOUGH_DATA
  isAvailable: boolean;
  reason?: string;
}

export interface AlignmentResult {
  alignmentScore: number | null;
  academicScore: number | null;
  interestScore: number | null;
  activityScore: number | null;
  availableDimensionsCount: number;
  includedDimensions: Array<'academic' | 'interest' | 'activity'>;
  omittedDimensions: Array<'academic' | 'interest' | 'activity'>;
}

/**
 * 1. Academic Score Calculation
 * Completed = 1.0, In-Progress = 0.5, Planned or absent = 0.0.
 * Normalized by sum of mapped subject weights * 100.
 * If student has recorded zero subjects, returns null (NOT_ENOUGH_DATA).
 */
export function calculateAcademicScore(
  careerSubjects: CareerSubject[],
  studentSubjects: StudentSubject[]
): DimensionScoreResult {
  if (!careerSubjects || careerSubjects.length === 0) {
    return { score: null, isAvailable: false, reason: 'No academic subjects mapped to this career' };
  }

  // If student has zero subjects entered at all, it's NOT_ENOUGH_DATA
  if (!studentSubjects || studentSubjects.length === 0) {
    return { score: null, isAvailable: false, reason: 'Student has not recorded any academic subjects' };
  }

  const subjectMap = new Map<number, StudentSubject>();
  for (const s of studentSubjects) {
    subjectMap.set(s.subject_id, s);
  }

  let totalWeight = 0;
  let weightedEarned = 0;

  for (const cs of careerSubjects) {
    const weight = Number(cs.importance_weight) || 1;
    totalWeight += weight;

    const studentSub = subjectMap.get(cs.subject_id);
    if (studentSub) {
      if (studentSub.study_status === 'COMPLETED') {
        weightedEarned += weight * 1.0;
      } else if (studentSub.study_status === 'IN_PROGRESS') {
        weightedEarned += weight * 0.5;
      }
      // PLANNED receives 0.0
    }
  }

  if (totalWeight === 0) {
    return { score: null, isAvailable: false, reason: 'Total mapped subject weight is zero' };
  }

  const rawScore = (weightedEarned / totalWeight) * 100;
  const rounded = Math.round(rawScore * 10) / 10;
  return { score: rounded, isAvailable: true };
}

/**
 * 2. Interest / Activity Score Calculation
 * Requires at least 3 ratings in that dimension to be eligible (SRS 5.3 & FR-PREF-02).
 * Dimension score = weighted average of (rating / 5) * 100 for mapped tags with student ratings.
 */
export function calculatePreferenceDimensionScore(
  careerTags: CareerInterestTag[],
  studentPreferences: StudentPreference[],
  allTagsInDimensionCount: number, // total ratings student gave in this tag dimension (INTEREST or ACTIVITY)
  dimensionName: 'interest' | 'activity',
  minRequiredRatings: number = 3
): DimensionScoreResult {
  if (allTagsInDimensionCount < minRequiredRatings) {
    return {
      score: null,
      isAvailable: false,
      reason: `At least ${minRequiredRatings} ${dimensionName} ratings required (currently ${allTagsInDimensionCount})`,
    };
  }

  if (!careerTags || careerTags.length === 0) {
    return { score: null, isAvailable: false, reason: `No ${dimensionName} tags mapped to this career` };
  }

  const prefMap = new Map<number, number>();
  for (const p of studentPreferences) {
    prefMap.set(p.interest_tag_id, p.preference_score);
  }

  let totalRatedWeight = 0;
  let weightedEarned = 0;

  for (const ct of careerTags) {
    const scoreVal = prefMap.get(ct.interest_tag_id);
    if (scoreVal !== undefined && scoreVal >= 1 && scoreVal <= 5) {
      const weight = Number(ct.importance_weight) || 1;
      totalRatedWeight += weight;
      weightedEarned += weight * ((scoreVal / 5) * 100);
    }
  }

  if (totalRatedWeight === 0) {
    return {
      score: null,
      isAvailable: false,
      reason: `None of the mapped ${dimensionName} tags have been rated by the student`,
    };
  }

  const rawScore = weightedEarned / totalRatedWeight;
  const rounded = Math.round(rawScore * 10) / 10;
  return { score: rounded, isAvailable: true };
}

/**
 * 3. Career Alignment Score Calculation
 * Default weights: Academic = 0.30, Interest = 0.45, Activity = 0.25.
 * Re-normalizes across available dimensions if any are NOT_ENOUGH_DATA (SRS BR-10).
 */
export function calculateAlignmentScore(
  academic: DimensionScoreResult,
  interest: DimensionScoreResult,
  activity: DimensionScoreResult
): AlignmentResult {
  const baseWeights = {
    academic: 0.30,
    interest: 0.45,
    activity: 0.25,
  };

  const included: Array<'academic' | 'interest' | 'activity'> = [];
  const omitted: Array<'academic' | 'interest' | 'activity'> = [];

  let totalAvailableWeight = 0;
  if (academic.isAvailable && academic.score !== null) {
    included.push('academic');
    totalAvailableWeight += baseWeights.academic;
  } else {
    omitted.push('academic');
  }

  if (interest.isAvailable && interest.score !== null) {
    included.push('interest');
    totalAvailableWeight += baseWeights.interest;
  } else {
    omitted.push('interest');
  }

  if (activity.isAvailable && activity.score !== null) {
    included.push('activity');
    totalAvailableWeight += baseWeights.activity;
  } else {
    omitted.push('activity');
  }

  if (included.length === 0 || totalAvailableWeight === 0) {
    return {
      alignmentScore: null,
      academicScore: academic.score,
      interestScore: interest.score,
      activityScore: activity.score,
      availableDimensionsCount: 0,
      includedDimensions: [],
      omittedDimensions: omitted,
    };
  }

  let finalScore = 0;
  if (academic.isAvailable && academic.score !== null) {
    const normWeight = baseWeights.academic / totalAvailableWeight;
    finalScore += normWeight * academic.score;
  }
  if (interest.isAvailable && interest.score !== null) {
    const normWeight = baseWeights.interest / totalAvailableWeight;
    finalScore += normWeight * interest.score;
  }
  if (activity.isAvailable && activity.score !== null) {
    const normWeight = baseWeights.activity / totalAvailableWeight;
    finalScore += normWeight * activity.score;
  }

  const rounded = Math.round(finalScore * 10) / 10;

  return {
    alignmentScore: rounded,
    academicScore: academic.score,
    interestScore: interest.score,
    activityScore: activity.score,
    availableDimensionsCount: included.length,
    includedDimensions: included,
    omittedDimensions: omitted,
  };
}

/**
 * 4. Skill Gap & Skill Coverage Calculation
 * Strictly separated from alignment score (SRS BR-11).
 * For CORE and IMPORTANT skills:
 * ratio = min(studentLevel / targetLevel, 1.0)
 * Missing student skill contributes 0.
 * OPTIONAL skills are excluded from coverage denominator.
 */
export function calculateSkillGapAndCoverage(
  careerId: number,
  careerTitle: string,
  careerSkills: CareerSkill[],
  studentSkills: StudentSkill[],
  skillsTaxonomy: Map<number, Skill>
): SkillGapAnalysis {
  const studentMap = new Map<number, ProficiencyLevel>();
  for (const sk of studentSkills) {
    studentMap.set(sk.skill_id, sk.proficiency_level);
  }

  let coreAndImportantWeightTotal = 0;
  let weightedEarnedTotal = 0;
  let matchedCount = 0;
  let developingCount = 0;
  let missingCount = 0;

  const items: SkillGapItem[] = [];

  for (const cs of careerSkills) {
    const skillMeta = skillsTaxonomy.get(cs.skill_id);
    const skillName = skillMeta ? skillMeta.skill_name : `Skill #${cs.skill_id}`;
    const skillCategory = skillMeta ? skillMeta.skill_category : 'General';

    const studentLevel = studentMap.get(cs.skill_id) ?? null;
    let status: SkillGapStatus = 'MISSING';
    let ratio = 0;

    if (studentLevel === null) {
      status = 'MISSING';
      ratio = 0;
      missingCount++;
    } else if (studentLevel >= cs.target_level) {
      status = 'MEETS_TARGET';
      ratio = 1.0;
      matchedCount++;
    } else {
      status = 'DEVELOPING';
      ratio = studentLevel / cs.target_level;
      developingCount++;
    }

    const weight = Number(cs.importance_weight) || 1;

    // CORE and IMPORTANT contribute to skill coverage denominator
    if (cs.requirement_type === 'CORE' || cs.requirement_type === 'IMPORTANT') {
      coreAndImportantWeightTotal += weight;
      weightedEarnedTotal += weight * ratio;
    }

    items.push({
      skillId: cs.skill_id,
      skillName,
      skillCategory,
      targetLevel: cs.target_level,
      studentLevel,
      status,
      requirementType: cs.requirement_type,
      importanceWeight: weight,
      ratio: Math.round(ratio * 100) / 100,
      mappingNote: cs.mapping_note,
    });
  }

  const rawCoverage =
    coreAndImportantWeightTotal > 0
      ? (weightedEarnedTotal / coreAndImportantWeightTotal) * 100
      : 0;
  const skillCoverage = Math.round(rawCoverage * 10) / 10;

  return {
    careerId,
    careerTitle,
    skillCoverage,
    coreAndImportantWeightTotal,
    matchedCount,
    developingCount,
    missingCount,
    items,
  };
}

/**
 * 5. Profile Completeness Indicator
 * 0 - 100 scale representing how ready the student's profile is for full analysis.
 */
export function calculateProfileCompleteness(
  hasAcademicInfo: boolean,
  subjectsCount: number,
  skillsCount: number,
  interestRatingsCount: number,
  activityRatingsCount: number
): number {
  let score = 0;
  if (hasAcademicInfo) score += 20;
  if (subjectsCount >= 1) score += Math.min(20, subjectsCount * 4); // max 20 for 5+ subjects
  if (skillsCount >= 1) score += Math.min(20, skillsCount * 4); // max 20 for 5+ skills
  if (interestRatingsCount >= 3) score += 20;
  else score += Math.round((interestRatingsCount / 3) * 20);
  if (activityRatingsCount >= 3) score += 20;
  else score += Math.round((activityRatingsCount / 3) * 20);

  return Math.min(100, score);
}
