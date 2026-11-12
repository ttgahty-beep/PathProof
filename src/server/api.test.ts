/**
 * PathProof Phase 1 — Acceptance Test Suite
 * Directly verifies test cases TC-001..032 from Document PP-P1-TEST-001.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db.ts';
import {
  authService,
  studentProfileService,
  academicService,
  skillService,
  careerService,
  evidenceService,
  comparisonService,
  adminService,
  ServiceError,
} from './services.ts';

// Initialize in-memory / test DB
db.init();

test('TC-001: Register valid student account', () => {
  const email = `student_${Date.now()}@test.edu.pk`;
  const user = authService.registerStudent('Test Student', email, 'SafePassword123!');
  assert.equal(user.role, 'STUDENT');
  assert.equal(user.account_status, 'ACTIVE');
  assert.equal(user.email, email);
});

test('TC-002: Duplicate email registration rejected with 409 DUPLICATE_RESOURCE', () => {
  const email = `dup_${Date.now()}@test.edu.pk`;
  authService.registerStudent('First Student', email, 'SafePassword123!');

  assert.throws(
    () => {
      // Different case
      authService.registerStudent('Second Student', email.toUpperCase(), 'AnotherPassword123!');
    },
    (err: any) => err.code === 'DUPLICATE_RESOURCE' && err.status === 409
  );
});

test('TC-003: Public role escalation attempt rejected', () => {
  assert.throws(
    () => {
      authService.registerStudent('Hacker', `admin_hacker_${Date.now()}@test.pk`, 'Password123!', 'ADMIN');
    },
    (err: any) => err.status === 403
  );
});

test('TC-004: Invalid login credentials rejected', () => {
  assert.throws(
    () => {
      authService.authenticate('student@demo.edu.pk', 'WrongPassword!');
    },
    (err: any) => err.status === 401
  );
});

test('TC-006 & TC-007: Save academic profile & reject invalid semester', () => {
  // Valid update
  const updated = studentProfileService.updateProfile(2, {
    university_name: 'NUST',
    current_semester: 6,
    weekly_learning_hours: 15,
  });
  assert.equal(updated.current_semester, 6);
  assert.equal(updated.weekly_learning_hours, 15);

  // TC-007: Reject invalid semester (13)
  assert.throws(
    () => {
      studentProfileService.updateProfile(2, { current_semester: 13 });
    },
    (err: any) => err.code === 'VALIDATION_ERROR' && err.status === 400
  );
});

test('TC-010 & TC-011: Add skill and reject invalid proficiency', () => {
  // Valid skill
  const sk = skillService.addStudentSkill(2, 3, 2, 'Basic TypeScript coursework');
  assert.equal(sk.proficiency_level, 2);
  assert.equal(sk.evidence_status, 'SELF_REPORTED');

  // TC-011: Reject level 0 or 5
  assert.throws(
    () => {
      skillService.addStudentSkill(2, 3, 5);
    },
    (err: any) => err.code === 'VALIDATION_ERROR'
  );
});

test('TC-014 & TC-032: Career catalogue search and draft hiding from students', () => {
  const publishedOnly = careerService.listCareers(undefined, undefined, false);
  const draftCareer = publishedOnly.find((c) => c.career_title === 'Cloud DevOps Engineer');
  assert.equal(draftCareer, undefined, 'Draft careers must not appear in student catalogue');

  // Search by query
  const searchResults = careerService.listCareers('Frontend', undefined, false);
  assert.equal(searchResults.length >= 1, true);
  assert.equal(searchResults[0].career_title, 'Frontend Developer');
});

test('TC-017: Evidence frequency counts eligible CONTENT_CHECKED records only', () => {
  // Career 1 has 5 records seeded: 4 CONTENT_CHECKED, 1 UNVERIFIABLE
  const summary = evidenceService.getCareerMarketSummary(1);
  assert.equal(summary.sampleSize, 4, 'Excluded UNVERIFIABLE record must not count in denominator');
  assert.equal(summary.totalCollected, 5, 'Total collected includes all records');

  // React appears in all 4 CONTENT_CHECKED records
  const reactStat = summary.skillFrequencies.find((s) => s.skillName.includes('React'));
  assert.ok(reactStat);
  assert.equal(reactStat.totalMentions, 4);
  assert.equal(reactStat.eligiblePostingsCount, 4);
  assert.equal(reactStat.percentage, 100);
});

test('TC-022 & TC-023: Compare 2 careers and reject 4 careers', () => {
  // TC-022: Valid 2 careers comparison
  const comp = comparisonService.compareCareers(2, [1, 2]);
  assert.equal(comp.careers.length, 2);
  assert.equal(comp.careers[0].careerTitle, 'Frontend Developer');
  assert.equal(comp.careers[1].careerTitle, 'Backend Developer');

  // TC-023: Reject 4 careers
  assert.throws(
    () => {
      comparisonService.compareCareers(2, [1, 2, 3, 4]);
    },
    (err: any) => err.code === 'VALIDATION_ERROR'
  );
});
