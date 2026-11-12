/**
 * PathProof — Unified Career Intelligence Hook
 * Consolidates student profile, coursework, self-reported skills, career catalogue,
 * market summaries, and explainable recommendations for the design concepts.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient.ts';
import {
  SafeUser,
  StudentProfile,
  StudentSubject,
  AcademicSubject,
  StudentSkill,
  Skill,
  StudentPreference,
  InterestTag,
  Career,
  CareerRecommendation,
  CareerAssessment,
  CareerMarketSummary,
} from '../types/index.ts';

export interface PathProofIntelligenceState {
  currentUser: SafeUser | null;
  profile: StudentProfile | null;
  studentSubjects: StudentSubject[];
  allSubjects: AcademicSubject[];
  studentSkills: StudentSkill[];
  allSkills: Skill[];
  preferences: StudentPreference[];
  allTags: InterestTag[];
  careers: Career[];
  marketSummaries: Record<number, CareerMarketSummary>;
  recommendations: CareerRecommendation[];
  assessment: CareerAssessment | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  generateRecommendations: () => Promise<void>;
}

export function usePathProofIntelligence(): PathProofIntelligenceState {
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(apiClient.getCurrentUser());
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [studentSubjects, setStudentSubjects] = useState<StudentSubject[]>([]);
  const [allSubjects, setAllSubjects] = useState<AcademicSubject[]>([]);
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [preferences, setPreferences] = useState<StudentPreference[]>([]);
  const [allTags, setAllTags] = useState<InterestTag[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [marketSummaries, setMarketSummaries] = useState<Record<number, CareerMarketSummary>>({});
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [assessment, setAssessment] = useState<CareerAssessment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // If not logged in, auto-login as Hamza Tariq for demo exploration
      let user = apiClient.getCurrentUser();
      if (!user) {
        try {
          const authRes = await apiClient.login('student@demo.edu.pk', 'StudentPassword123!');
          user = authRes.user;
          setCurrentUser(user);
        } catch (loginErr) {
          console.warn('Auto demo login warning:', loginErr);
        }
      } else {
        setCurrentUser(user);
      }

      // Load core catalogues and student records
      const [
        prof,
        sSubs,
        aSubs,
        sSkills,
        aSkills,
        prefs,
        tags,
        carList,
      ] = await Promise.all([
        apiClient.getProfile().catch(() => null),
        apiClient.getStudentSubjects().catch(() => []),
        apiClient.getActiveSubjects().catch(() => []),
        apiClient.getStudentSkills().catch(() => []),
        apiClient.getActiveSkills().catch(() => []),
        apiClient.getStudentPreferences().catch(() => []),
        apiClient.getInterestTags().catch(() => []),
        apiClient.getCareers().catch(() => []),
      ]);

      setProfile(prof);
      setStudentSubjects(sSubs);
      setAllSubjects(aSubs);
      setStudentSkills(sSkills);
      setAllSkills(aSkills);
      setPreferences(prefs);
      setAllTags(tags);
      setCareers(carList);

      // Load recommendations (or calculate if none exist)
      let recs: CareerRecommendation[] = [];
      let assess: CareerAssessment | null = null;

      const normalizeRec = (r: any, idx: number): CareerRecommendation => ({
        recommendation_id: r.recommendation_id || r.recommendationId || r.career_id || r.careerId || idx + 1,
        assessment_id: r.assessment_id || r.assessmentId || 1,
        career_id: r.career_id ?? r.careerId,
        career_title: r.career_title || r.careerTitle,
        category_name: r.category_name || r.categoryName,
        academic_score: r.academic_score ?? r.components?.academic ?? null,
        interest_score: r.interest_score ?? r.components?.interest ?? null,
        activity_score: r.activity_score ?? r.components?.activity ?? null,
        alignment_score: r.alignment_score ?? r.alignmentScore ?? 0,
        skill_coverage_score: r.skill_coverage_score ?? r.skillCoverageScore ?? 0,
        available_dimensions: r.available_dimensions ?? r.availableDimensions ?? 3,
        rank_position: r.rank_position ?? r.rankPosition ?? idx + 1,
        reasons: r.reasons || [],
        explanation_json: r.explanation_json || r.explanations,
      });

      try {
        const latest = await apiClient.getLatestRecommendations();
        const rawList = latest?.results || latest?.recommendations || [];
        if (Array.isArray(rawList) && rawList.length > 0) {
          recs = rawList.map(normalizeRec);
          assess = {
            assessment_id: latest.assessmentId || latest.assessment_id || 1,
            user_id: user?.user_id || 1,
            algorithm_version: latest.algorithmVersion || latest.algorithm_version || 'p1.0',
            profile_completeness: latest.profileCompleteness || latest.profile_completeness || 100,
            created_at: latest.createdAt || latest.created_at || new Date().toISOString(),
          };
        } else {
          const calculated = await apiClient.generateRecommendations();
          const calcList = calculated?.results || calculated?.recommendations || [];
          recs = (Array.isArray(calcList) ? calcList : []).map(normalizeRec);
          assess = {
            assessment_id: calculated.assessmentId || 1,
            user_id: user?.user_id || 1,
            algorithm_version: calculated.algorithmVersion || 'p1.0',
            profile_completeness: calculated.profileCompleteness || 100,
            created_at: calculated.createdAt || new Date().toISOString(),
          };
        }
      } catch {
        try {
          const calculated = await apiClient.generateRecommendations();
          const calcList = calculated?.results || calculated?.recommendations || [];
          recs = (Array.isArray(calcList) ? calcList : []).map(normalizeRec);
        } catch {
          // Ignore
        }
      }

      setRecommendations(recs);
      setAssessment(assess);

      // Fetch market summaries for top careers in parallel
      const summaryMap: Record<number, CareerMarketSummary> = {};
      const targetCareers = carList.slice(0, 6);
      const summaryPromises = targetCareers.map(async (c) => {
        try {
          const sum = await apiClient.getCareerMarketSummary(c.career_id);
          summaryMap[c.career_id] = sum;
        } catch {
          // ignore individual summary error
        }
      });
      await Promise.all(summaryPromises);
      setMarketSummaries(summaryMap);
    } catch (err: any) {
      console.error('Failed to load career intelligence data:', err);
      setError(err.message || 'Error loading intelligence data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.generateRecommendations();
      const rawList = res?.results || res?.recommendations || [];
      const normalized = (Array.isArray(rawList) ? rawList : []).map((r: any, idx: number) => ({
        recommendation_id: r.recommendation_id || r.recommendationId || r.career_id || r.careerId || idx + 1,
        assessment_id: r.assessment_id || r.assessmentId || 1,
        career_id: r.career_id ?? r.careerId,
        career_title: r.career_title || r.careerTitle,
        category_name: r.category_name || r.categoryName,
        academic_score: r.academic_score ?? r.components?.academic ?? null,
        interest_score: r.interest_score ?? r.components?.interest ?? null,
        activity_score: r.activity_score ?? r.components?.activity ?? null,
        alignment_score: r.alignment_score ?? r.alignmentScore ?? 0,
        skill_coverage_score: r.skill_coverage_score ?? r.skillCoverageScore ?? 0,
        available_dimensions: r.available_dimensions ?? r.availableDimensions ?? 3,
        rank_position: r.rank_position ?? r.rankPosition ?? idx + 1,
        reasons: r.reasons || [],
        explanation_json: r.explanation_json || r.explanations,
      }));
      setRecommendations(normalized);
      if (res?.assessmentId) {
        setAssessment({
          assessment_id: res.assessmentId,
          user_id: currentUser?.user_id || 1,
          algorithm_version: res.algorithmVersion || 'p1.0',
          profile_completeness: res.profileCompleteness || 100,
          created_at: res.createdAt || new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to recalculate recommendations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    currentUser,
    profile,
    studentSubjects,
    allSubjects,
    studentSkills,
    allSkills,
    preferences,
    allTags,
    careers,
    marketSummaries,
    recommendations,
    assessment,
    isLoading,
    error,
    refresh: loadData,
    generateRecommendations,
  };
}
