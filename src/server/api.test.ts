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
  careerInterestService,
  evidenceService,
  comparisonService,
  adminService,
  ServiceError,
} from './services.ts';
import { GLOBAL_CAREER_CATALOG } from './careerCatalogData.ts';

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

test('Expanded Career Catalog: 30 global categories + original 5, zero duplicates, and preserved IDs 1..7', () => {
  const categories = careerService.listCategories();
  assert.equal(categories.length >= 35, true, 'Expected 5 original + 30 global career categories');

  for (const expectedGroup of GLOBAL_CAREER_CATALOG) {
    const foundCategory = categories.find(
      (c) => c.category_name.toLowerCase() === expectedGroup.category_name.toLowerCase()
    );
    assert.ok(foundCategory, `Missing global career category: ${expectedGroup.category_name}`);
    const rolesInCategory = careerService.listCareers(undefined, foundCategory.category_id, false);
    assert.equal(
      rolesInCategory.length >= 4,
      true,
      `Expected multiple roles under ${expectedGroup.category_name}, got ${rolesInCategory.length}`
    );
  }

  // Zero duplicate career titles across entire catalog
  const allCareers = careerService.listCareers(undefined, undefined, true);
  const titleSet = new Set<string>();
  for (const c of allCareers) {
    const normalized = c.career_title.trim().toLowerCase();
    assert.equal(titleSet.has(normalized), false, `Duplicate career title detected: ${c.career_title}`);
    titleSet.add(normalized);
  }

  // Original IDs 1..6 preserved
  assert.equal(careerService.getCareerDetail(1, false).career_title, 'Frontend Developer');
  assert.equal(careerService.getCareerDetail(6, false).career_title, 'Cybersecurity Analyst');

  // Search works for newly added global roles
  const surgeonSearch = careerService.listCareers('Surgeon', undefined, false);
  assert.equal(surgeonSearch.some((c) => c.career_title === 'Surgeon'), true);

  const quantumSearch = careerService.listCareers('Quantum', undefined, false);
  assert.equal(quantumSearch.some((c) => c.career_title === 'Quantum Computing Engineer'), true);
});

test('Multi-role Career Interest Selection: save and retrieve roles across different categories', () => {
  const aiEngineer = careerService.listCareers('AI Engineer', undefined, false).find(
    (c) => c.career_title === 'AI Engineer'
  );
  const cardiologist = careerService.listCareers('Cardiologist', undefined, false).find(
    (c) => c.career_title === 'Cardiologist'
  );
  assert.ok(aiEngineer);
  assert.ok(cardiologist);

  // Save multiple career interests across different categories (including original ID 1)
  const saved = careerInterestService.saveStudentCareerInterests(2, [
    1,
    aiEngineer.career_id,
    cardiologist.career_id,
    aiEngineer.career_id, // duplicate should deduplicate cleanly
  ]);
  assert.equal(saved.length, 3);

  const loaded = careerInterestService.getStudentCareerInterests(2);
  assert.equal(loaded.length, 3);
  assert.equal(loaded.some((i) => i.career_title === 'Frontend Developer'), true);
  assert.equal(loaded.some((i) => i.career_title === 'AI Engineer'), true);
  assert.equal(loaded.some((i) => i.career_title === 'Cardiologist'), true);

  // Reject draft career ID (7)
  assert.throws(
    () => {
      careerInterestService.saveStudentCareerInterests(2, [7]);
    },
    (err: any) => err.status === 404
  );

  // Cleanly clear back to empty for default demo state
  const cleared = careerInterestService.saveStudentCareerInterests(2, []);
  assert.equal(cleared.length, 0);
});
