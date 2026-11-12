/**
 * PathProof Phase 1 — Scoring Unit Tests
 * Implements Section 6 "Scoring unit tests" from Document PP-P1-TEST-001.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAcademicScore,
  calculatePreferenceDimensionScore,
  calculateAlignmentScore,
  calculateSkillGapAndCoverage,
} from './scoring.ts';
import {
  CareerSubject,
  CareerInterestTag,
  StudentSubject,
  StudentPreference,
  CareerSkill,
  StudentSkill,
  Skill,
} from '../types/index.ts';

test('Academic completed: one mapped subject, weight 2, COMPLETED gives 100', () => {
  const careerSubjects: CareerSubject[] = [
    { career_id: 1, subject_id: 10, importance_weight: 2, mapping_note: 'Core subject' },
  ];
  const studentSubjects: StudentSubject[] = [
    {
      student_subject_id: 1,
      user_id: 100,
      subject_id: 10,
      study_status: 'COMPLETED',
      grade_text: 'A',
      semester_taken: 2,
      created_at: '',
      updated_at: '',
    },
  ];

  const res = calculateAcademicScore(careerSubjects, studentSubjects);
  assert.equal(res.isAvailable, true);
  assert.equal(res.score, 100);
});

test('Academic in progress: one mapped subject, weight 2, IN_PROGRESS gives 50', () => {
  const careerSubjects: CareerSubject[] = [
    { career_id: 1, subject_id: 10, importance_weight: 2, mapping_note: 'Core subject' },
  ];
  const studentSubjects: StudentSubject[] = [
    {
      student_subject_id: 1,
      user_id: 100,
      subject_id: 10,
      study_status: 'IN_PROGRESS',
      grade_text: null,
      semester_taken: 3,
      created_at: '',
      updated_at: '',
    },
  ];

  const res = calculateAcademicScore(careerSubjects, studentSubjects);
  assert.equal(res.isAvailable, true);
  assert.equal(res.score, 50);
});

test('Academic planned: one mapped subject, weight 2, PLANNED gives 0', () => {
  const careerSubjects: CareerSubject[] = [
    { career_id: 1, subject_id: 10, importance_weight: 2, mapping_note: 'Core subject' },
  ];
  const studentSubjects: StudentSubject[] = [
    {
      student_subject_id: 1,
      user_id: 100,
      subject_id: 10,
      study_status: 'PLANNED',
      grade_text: null,
      semester_taken: 5,
      created_at: '',
      updated_at: '',
    },
  ];

  const res = calculateAcademicScore(careerSubjects, studentSubjects);
  assert.equal(res.isAvailable, true);
  assert.equal(res.score, 0);
});

test('Interest rating: minimum three mapped interest ratings all rated 4/5 gives 80', () => {
  const careerTags: CareerInterestTag[] = [
    { career_id: 1, interest_tag_id: 1, importance_weight: 1, mapping_note: null },
    { career_id: 1, interest_tag_id: 2, importance_weight: 1, mapping_note: null },
    { career_id: 1, interest_tag_id: 3, importance_weight: 1, mapping_note: null },
  ];
  const prefs: StudentPreference[] = [
    { user_id: 100, interest_tag_id: 1, preference_score: 4, updated_at: '' },
    { user_id: 100, interest_tag_id: 2, preference_score: 4, updated_at: '' },
    { user_id: 100, interest_tag_id: 3, preference_score: 4, updated_at: '' },
  ];

  const res = calculatePreferenceDimensionScore(careerTags, prefs, 3, 'interest', 3);
  assert.equal(res.isAvailable, true);
  assert.equal(res.score, 80);
});

test('Activity rating: at least three mapped activity tags rated 5/5 gives 100', () => {
  const careerTags: CareerInterestTag[] = [
    { career_id: 1, interest_tag_id: 10, importance_weight: 1, mapping_note: null },
    { career_id: 1, interest_tag_id: 11, importance_weight: 1, mapping_note: null },
    { career_id: 1, interest_tag_id: 12, importance_weight: 1, mapping_note: null },
  ];
  const prefs: StudentPreference[] = [
    { user_id: 100, interest_tag_id: 10, preference_score: 5, updated_at: '' },
    { user_id: 100, interest_tag_id: 11, preference_score: 5, updated_at: '' },
    { user_id: 100, interest_tag_id: 12, preference_score: 5, updated_at: '' },
  ];

  const res = calculatePreferenceDimensionScore(careerTags, prefs, 3, 'activity', 3);
  assert.equal(res.isAvailable, true);
  assert.equal(res.score, 100);
});

test('Missing dimension: fewer than 3 activity ratings gives NOT_ENOUGH_DATA and re-normalizes alignment', () => {
  const careerTags: CareerInterestTag[] = [
    { career_id: 1, interest_tag_id: 10, importance_weight: 1, mapping_note: null },
  ];
  const prefs: StudentPreference[] = [
    { user_id: 100, interest_tag_id: 10, preference_score: 5, updated_at: '' },
  ];

  // Only 1 rating given, min required is 3
  const actRes = calculatePreferenceDimensionScore(careerTags, prefs, 1, 'activity', 3);
  assert.equal(actRes.isAvailable, false);
  assert.equal(actRes.score, null);

  // Now calculate alignment with Academic (80) and Interest (90) available, Activity unavailable
  const acadRes = { score: 80, isAvailable: true };
  const intRes = { score: 90, isAvailable: true };

  const alignment = calculateAlignmentScore(acadRes, intRes, actRes);
  assert.equal(alignment.availableDimensionsCount, 2);
  assert.deepEqual(alignment.includedDimensions, ['academic', 'interest']);
  assert.deepEqual(alignment.omittedDimensions, ['activity']);

  // Weights re-normalized:
  // Base: academic 0.30, interest 0.45 -> total 0.75
  // Normalized: academic = 0.30/0.75 = 0.40, interest = 0.45/0.75 = 0.60
  // Score = 0.40 * 80 + 0.60 * 90 = 32 + 54 = 86.0
  assert.equal(alignment.alignmentScore, 86.0);
});

test('Skill exact target: student level 3, target 3 gives ratio 1.0 and MEETS_TARGET', () => {
  const careerSkills: CareerSkill[] = [
    {
      career_id: 1,
      skill_id: 5,
      target_level: 3,
      importance_weight: 2,
      requirement_type: 'CORE',
      mapping_note: 'Database querying',
    },
  ];
  const studentSkills: StudentSkill[] = [
    {
      student_skill_id: 1,
      user_id: 100,
      skill_id: 5,
      proficiency_level: 3,
      evidence_status: 'SELF_REPORTED',
      notes: null,
      created_at: '',
      updated_at: '',
    },
  ];

  const taxonomy = new Map<number, Skill>();
  taxonomy.set(5, {
    skill_id: 5,
    skill_name: 'SQL',
    skill_category: 'Data',
    description: null,
    is_active: true,
    created_at: '',
    updated_at: '',
  });

  const analysis = calculateSkillGapAndCoverage(1, 'Backend Developer', careerSkills, studentSkills, taxonomy);
  assert.equal(analysis.items[0].status, 'MEETS_TARGET');
  assert.equal(analysis.items[0].ratio, 1.0);
  assert.equal(analysis.skillCoverage, 100);
});

test('Skill above target: student level 4, target 3 caps ratio at 1.0 and MEETS_TARGET', () => {
  const careerSkills: CareerSkill[] = [
    {
      career_id: 1,
      skill_id: 5,
      target_level: 3,
      importance_weight: 2,
      requirement_type: 'CORE',
      mapping_note: 'Database querying',
    },
  ];
  const studentSkills: StudentSkill[] = [
    {
      student_skill_id: 1,
      user_id: 100,
      skill_id: 5,
      proficiency_level: 4,
      evidence_status: 'SELF_REPORTED',
      notes: null,
      created_at: '',
      updated_at: '',
    },
  ];

  const taxonomy = new Map<number, Skill>();
  const analysis = calculateSkillGapAndCoverage(1, 'Backend Developer', careerSkills, studentSkills, taxonomy);
  assert.equal(analysis.items[0].status, 'MEETS_TARGET');
  assert.equal(analysis.items[0].ratio, 1.0);
  assert.equal(analysis.skillCoverage, 100);
});

test('Skill below target: student level 2, target 4 gives ratio 0.5 and DEVELOPING', () => {
  const careerSkills: CareerSkill[] = [
    {
      career_id: 1,
      skill_id: 5,
      target_level: 4,
      importance_weight: 2,
      requirement_type: 'CORE',
      mapping_note: 'Database querying',
    },
  ];
  const studentSkills: StudentSkill[] = [
    {
      student_skill_id: 1,
      user_id: 100,
      skill_id: 5,
      proficiency_level: 2,
      evidence_status: 'SELF_REPORTED',
      notes: null,
      created_at: '',
      updated_at: '',
    },
  ];

  const taxonomy = new Map<number, Skill>();
  const analysis = calculateSkillGapAndCoverage(1, 'Backend Developer', careerSkills, studentSkills, taxonomy);
  assert.equal(analysis.items[0].status, 'DEVELOPING');
  assert.equal(analysis.items[0].ratio, 0.5);
  assert.equal(analysis.skillCoverage, 50);
});

test('Skill missing: no student skill row gives ratio 0 and MISSING', () => {
  const careerSkills: CareerSkill[] = [
    {
      career_id: 1,
      skill_id: 5,
      target_level: 3,
      importance_weight: 2,
      requirement_type: 'CORE',
      mapping_note: null,
    },
  ];
  const studentSkills: StudentSkill[] = [];

  const taxonomy = new Map<number, Skill>();
  const analysis = calculateSkillGapAndCoverage(1, 'Backend Developer', careerSkills, studentSkills, taxonomy);
  assert.equal(analysis.items[0].status, 'MISSING');
  assert.equal(analysis.items[0].studentLevel, null);
  assert.equal(analysis.items[0].ratio, 0);
  assert.equal(analysis.skillCoverage, 0);
});

test('Weighted coverage: 2 skills with different weights and ratios match formula', () => {
  // Skill 1: weight 3, target 3, student level 3 (ratio = 1.0) -> contribution = 3 * 1.0 = 3
  // Skill 2: weight 2, target 4, student level 2 (ratio = 0.5) -> contribution = 2 * 0.5 = 1
  // Total weight = 3 + 2 = 5
  // Total coverage = (3 + 1) / 5 * 100 = 80.0%
  const careerSkills: CareerSkill[] = [
    { career_id: 1, skill_id: 1, target_level: 3, importance_weight: 3, requirement_type: 'CORE', mapping_note: null },
    { career_id: 1, skill_id: 2, target_level: 4, importance_weight: 2, requirement_type: 'IMPORTANT', mapping_note: null },
  ];
  const studentSkills: StudentSkill[] = [
    { student_skill_id: 1, user_id: 100, skill_id: 1, proficiency_level: 3, evidence_status: 'SELF_REPORTED', notes: null, created_at: '', updated_at: '' },
    { student_skill_id: 2, user_id: 100, skill_id: 2, proficiency_level: 2, evidence_status: 'SELF_REPORTED', notes: null, created_at: '', updated_at: '' },
  ];

  const taxonomy = new Map<number, Skill>();
  const analysis = calculateSkillGapAndCoverage(1, 'Developer', careerSkills, studentSkills, taxonomy);
  assert.equal(analysis.skillCoverage, 80.0);
  assert.equal(analysis.matchedCount, 1);
  assert.equal(analysis.developingCount, 1);
  assert.equal(analysis.missingCount, 0);
});
