/**
 * PathProof Phase 1 — Core Domain Types and Data Contracts
 * Defined according to Document PP-P1-DB-001 (Database Design & Data Dictionary)
 * and PP-P1-API-001 (REST API Specification).
 */

export type UserRole = 'STUDENT' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'DISABLED';

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export type SafeUser = Omit<User, 'password_hash'>;

export type BudgetPreference = 'FREE_ONLY' | 'LOW_COST' | 'FLEXIBLE' | 'NOT_SPECIFIED';
export type LearningPreference = 'VIDEO' | 'READING' | 'PRACTICE' | 'MIXED' | 'NOT_SPECIFIED';

export interface StudentProfile {
  profile_id: number;
  user_id: number;
  university_name: string | null;
  degree_program: string | null;
  current_semester: number | null; // 1-12
  graduation_year: number | null;
  weekly_learning_hours: number | null; // 0-80
  budget_preference: BudgetPreference;
  learning_preference: LearningPreference;
  created_at: string;
  updated_at: string;
}

export interface AcademicSubject {
  subject_id: number;
  subject_name: string;
  subject_category: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type StudyStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';

export interface StudentSubject {
  student_subject_id: number;
  user_id: number;
  subject_id: number;
  subject_name?: string;
  subject_category?: string | null;
  study_status: StudyStatus;
  grade_text: string | null;
  semester_taken: number | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  skill_id: number;
  skill_name: string;
  skill_category: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProficiencyLevel = 1 | 2 | 3 | 4; // 1: Beginner, 2: Basic, 3: Intermediate, 4: Advanced

export interface StudentSkill {
  student_skill_id: number;
  user_id: number;
  skill_id: number;
  proficiency_level: ProficiencyLevel;
  evidence_status: 'SELF_REPORTED';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CareerCategory {
  category_id: number;
  category_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PublicationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Career {
  career_id: number;
  category_id: number;
  category_name?: string;
  career_title: string;
  summary: string;
  description: string;
  responsibilities: string | null;
  entry_level_tasks: string | null;
  education_notes: string | null;
  publication_status: PublicationStatus;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CareerComparisonSession {
  session_id: number;
  user_id: number;
  created_at: string;
}

export interface CareerComparisonItem {
  session_id: number;
  career_id: number;
  display_order: number;
}

export type RequirementType = 'CORE' | 'IMPORTANT' | 'OPTIONAL';

export interface CareerSkill {
  career_id: number;
  skill_id: number;
  target_level: ProficiencyLevel;
  importance_weight: number;
  requirement_type: RequirementType;
  mapping_note: string | null;
}

export interface CareerSubject {
  career_id: number;
  subject_id: number;
  importance_weight: number;
  mapping_note: string | null;
}

export type TagType = 'INTEREST' | 'ACTIVITY';

export interface InterestTag {
  interest_tag_id: number;
  tag_code: string;
  tag_label: string;
  tag_type: TagType;
  description: string | null;
  is_active: boolean;
}

export interface StudentPreference {
  user_id: number;
  interest_tag_id: number;
  preference_score: number; // 1 to 5
  updated_at: string;
}

export interface StudentCareerInterest {
  user_id: number;
  career_id: number;
  created_at: string;
}

export interface CareerInterestTag {
  career_id: number;
  interest_tag_id: number;
  importance_weight: number;
  mapping_note: string | null;
}

export type WorkMode = 'ONSITE' | 'HYBRID' | 'REMOTE' | 'NOT_SPECIFIED';
export type PostingStatus = 'OPEN_AT_CHECK' | 'CLOSED_OR_EXPIRED' | 'NOT_STATED';
export type VerificationStatus = 'CONTENT_CHECKED' | 'ACCESSIBLE_UNCONFIRMED' | 'UNVERIFIABLE' | 'ARCHIVED';

export interface JobEvidence {
  evidence_id: number;
  career_id: number;
  job_title: string;
  organization_name: string | null;
  location_text: string | null;
  work_mode: WorkMode;
  source_name: string;
  source_url: string;
  posted_date: string | null;
  collected_at: string;
  last_checked_at: string | null;
  posting_status: PostingStatus;
  verification_status: VerificationStatus;
  experience_level: string | null;
  education_text: string | null;
  notes: string | null;
}

export type MentionType = 'REQUIRED' | 'PREFERRED';

export interface JobEvidenceSkill {
  evidence_id: number;
  skill_id: number;
  mention_type: MentionType;
  evidence_quote_note: string | null;
}

export interface CareerAssessment {
  assessment_id: number;
  user_id: number;
  algorithm_version: string;
  profile_completeness: number; // 0-100
  created_at: string;
}

export interface RecommendationExplanation {
  academicReasons: string[];
  interestReasons: string[];
  activityReasons: string[];
  skillReasons: string[];
  evidenceNotes: string[];
  missingInputs: string[];
  reasons?: string[];
  dimensions?: any;
}

export interface CareerRecommendation {
  recommendation_id: number;
  assessment_id: number;
  career_id: number;
  career_title?: string;
  category_name?: string;
  academic_score: number | null;
  interest_score: number | null;
  activity_score: number | null;
  alignment_score: number | null;
  skill_coverage_score: number;
  available_dimensions: number; // 0 to 3
  rank_position: number | null;
  explanation_json: RecommendationExplanation;
  reasons?: string[];
}

export interface AdminAuditLog {
  audit_id: number;
  admin_user_id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  summary: string;
  created_at: string;
}

// Skill Gap status enum
export type SkillGapStatus = 'MEETS_TARGET' | 'DEVELOPING' | 'MISSING';

export interface SkillGapItem {
  skillId: number;
  skillName: string;
  skillCategory: string;
  targetLevel: ProficiencyLevel;
  studentLevel: ProficiencyLevel | null;
  status: SkillGapStatus;
  requirementType: RequirementType;
  importanceWeight: number;
  ratio: number;
  mappingNote: string | null;
}

export interface SkillGapAnalysis {
  careerId: number;
  careerTitle: string;
  skillCoverage: number;
  coreAndImportantWeightTotal: number;
  matchedCount: number;
  developingCount: number;
  missingCount: number;
  items: SkillGapItem[];
}

// Career Market Summary for Job Reality Engine
export interface MarketSkillFrequency {
  skillId: number;
  skillName: string;
  skillCategory: string;
  requiredCount: number;
  preferredCount: number;
  totalMentions: number;
  eligiblePostingsCount: number;
  percentage: number; // e.g. 80.0
}

export interface CareerMarketSummary {
  careerId: number;
  careerTitle: string;
  sampleSize: number;
  totalCollected: number;
  dateRange: {
    earliest: string | null;
    latest: string | null;
  };
  sampleLimitedDisclaimer: string;
  skillFrequencies: MarketSkillFrequency[];
}

// Standard REST envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
  meta?: {
    requestId?: string;
    timestamp?: string;
  };
}

export interface AppNotification {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'EVIDENCE_UPDATE' | 'SKILL_GAP' | 'SYSTEM' | 'RECOMMENDATION';
  link_tab?: string;
  is_read: boolean;
  created_at: string;
}

// -----------------------------------------------------------------------------
// PathProof Copilot Domain Models
// -----------------------------------------------------------------------------

export interface CopilotConversation {
  conversation_id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export type CopilotSender = 'user' | 'copilot';
export type CopilotActionType = 'NONE' | 'PROPOSE_ROADMAP' | 'PROPOSE_SKILL_GOAL' | 'PROJECT_FEEDBACK';

export interface RoadmapMilestone {
  milestone_id?: number;
  week_number: number;
  title: string;
  description: string;
  estimated_hours: number;
  learning_activities: string[];
  completion_criteria: string;
  is_completed?: boolean;
}

export interface RoadmapPayload {
  title: string;
  career_id?: number;
  career_title?: string;
  total_weeks: number;
  target_role: string;
  milestones: RoadmapMilestone[];
}

export interface CopilotMessage {
  message_id: number;
  conversation_id: number;
  sender: CopilotSender;
  content: string;
  action_type: CopilotActionType;
  action_id?: number | null;
  action_payload?: RoadmapPayload | null;
  created_at: string;
  is_fallback?: boolean;
}

export interface CopilotAction {
  action_id: number;
  user_id: number;
  conversation_id: number;
  action_type: CopilotActionType;
  payload: any;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  created_at: string;
  confirmed_at: string | null;
}

export interface StudentRoadmapMilestone {
  milestone_id: number;
  roadmap_id: number;
  week_number: number;
  title: string;
  description: string;
  estimated_hours: number;
  learning_activities: string[];
  completion_criteria: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface StudentRoadmap {
  roadmap_id: number;
  user_id: number;
  title: string;
  career_id: number | null;
  target_role: string;
  total_weeks: number;
  status: 'ACTIVE' | 'ARCHIVED';
  created_at: string;
  milestones: StudentRoadmapMilestone[];
}

