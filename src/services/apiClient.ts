/**
 * PathProof Phase 1 — Frontend API Client
 * Connects to /api/v1 endpoints with token management and standardized error parsing.
 */

import {
  ApiResponse,
  SafeUser,
  StudentProfile,
  AcademicSubject,
  StudentSubject,
  Skill,
  StudentSkill,
  Career,
  CareerCategory,
  InterestTag,
  StudentPreference,
  StudentCareerInterest,
  CareerMarketSummary,
  SkillGapAnalysis,
  AppNotification,
  CopilotConversation,
  CopilotMessage,
  StudentRoadmap,
  StudentRoadmapMilestone,
  RoadmapPayload,
} from '../types/index.ts';

const TOKEN_KEY = 'pathproof_auth_token';
const USER_KEY = 'pathproof_auth_user';

class ApiClient {
  private token: string | null = null;
  private currentUser: SafeUser | null = null;

  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch {
        this.currentUser = null;
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public getCurrentUser(): SafeUser | null {
    return this.currentUser;
  }

  public setSession(token: string, user: SafeUser): void {
    this.token = token;
    this.currentUser = user;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public clearSession(): void {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      headers['x-session-id'] = this.token;
    }

    const res = await fetch(`/api/v1${endpoint}`, {
      ...options,
      headers,
    });

    let json: ApiResponse<T>;
    try {
      json = await res.json();
    } catch {
      throw new Error(`Server returned HTTP ${res.status} with non-JSON body.`);
    }

    if (!json.success || !res.ok) {
      const err = new Error(json.error?.message || `Request failed with HTTP ${res.status}`);
      (err as any).code = json.error?.code || 'UNKNOWN_ERROR';
      (err as any).fields = json.error?.fields;
      (err as any).status = res.status;
      throw err;
    }

    return json.data as T;
  }

  // Auth
  public async register(fullName: string, email: string, password: string, role?: string) {
    const res = await this.request<{ user: SafeUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, role }),
    });
    this.setSession(res.token, res.user);
    return res;
  }

  public async login(email: string, password: string) {
    const res = await this.request<{ user: SafeUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setSession(res.token, res.user);
    return res;
  }

  public async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      this.clearSession();
    }
  }

  public async getMe(): Promise<SafeUser> {
    const res = await this.request<{ user: SafeUser }>('/auth/me');
    this.currentUser = res.user;
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    return res.user;
  }

  // Profile
  public async getProfile(): Promise<StudentProfile> {
    return this.request<StudentProfile>('/students/me/profile');
  }

  public async updateProfile(profile: Partial<StudentProfile>): Promise<StudentProfile> {
    return this.request<StudentProfile>('/students/me/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Academics
  public async getActiveSubjects(): Promise<AcademicSubject[]> {
    return this.request<AcademicSubject[]>('/academic-subjects');
  }

  public async getStudentSubjects(): Promise<StudentSubject[]> {
    return this.request<StudentSubject[]>('/students/me/subjects');
  }

  public async addStudentSubject(
    subjectIdOrObj:
      | number
      | {
          subject_id?: number;
          subjectId?: number;
          study_status?: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
          studyStatus?: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
          grade_text?: string | null;
          gradeText?: string | null;
          semester_taken?: number | null;
          semesterTaken?: number | null;
        },
    studyStatus?: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED',
    gradeText?: string | null,
    semesterTaken?: number | null
  ) {
    let sId: number;
    let sStatus: any;
    let gText: any;
    let semTaken: any;

    if (typeof subjectIdOrObj === 'object') {
      sId = Number(subjectIdOrObj.subject_id ?? subjectIdOrObj.subjectId);
      sStatus = subjectIdOrObj.study_status ?? subjectIdOrObj.studyStatus ?? 'COMPLETED';
      gText = subjectIdOrObj.grade_text ?? subjectIdOrObj.gradeText ?? null;
      semTaken = subjectIdOrObj.semester_taken ?? subjectIdOrObj.semesterTaken ?? null;
    } else {
      sId = subjectIdOrObj;
      sStatus = studyStatus;
      gText = gradeText;
      semTaken = semesterTaken;
    }

    return this.request<StudentSubject>('/students/me/subjects', {
      method: 'POST',
      body: JSON.stringify({ subjectId: sId, studyStatus: sStatus, gradeText: gText, semesterTaken: semTaken }),
    });
  }

  public async removeStudentSubject(id: number) {
    return this.request(`/students/me/subjects/${id}`, { method: 'DELETE' });
  }

  // Skills
  public async getActiveSkills(): Promise<Skill[]> {
    return this.request<Skill[]>('/skills');
  }

  public async getStudentSkills(): Promise<StudentSkill[]> {
    return this.request<StudentSkill[]>('/students/me/skills');
  }

  public async addStudentSkill(skillId: number, proficiencyLevel: number, notes?: string | null) {
    return this.request<StudentSkill>('/students/me/skills', {
      method: 'POST',
      body: JSON.stringify({ skillId, proficiencyLevel, notes }),
    });
  }

  public async updateStudentSkill(id: number, proficiencyLevel: number, notes?: string | null) {
    return this.request<StudentSkill>(`/students/me/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ proficiencyLevel, notes }),
    });
  }

  public async removeStudentSkill(id: number) {
    return this.request(`/students/me/skills/${id}`, { method: 'DELETE' });
  }

  // Preferences
  public async getInterestTags(): Promise<InterestTag[]> {
    return this.request<InterestTag[]>('/interest-tags');
  }

  public async getStudentPreferences(): Promise<StudentPreference[]> {
    return this.request<StudentPreference[]>('/students/me/preferences');
  }

  public async updateStudentPreferences(preferences: Array<{ interestTagId: number; preferenceScore: number }>) {
    return this.request<StudentPreference[]>('/students/me/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  public async saveStudentPreferences(preferences: Array<any>): Promise<StudentPreference[]> {
    const normalized = preferences.map((p) => ({
      interestTagId: Number(p.interestTagId ?? p.interest_tag_id),
      preferenceScore: Number(p.preferenceScore ?? p.preference_score),
    }));
    return this.updateStudentPreferences(normalized);
  }

  // Careers & Evidence
  public async getCareerCategories(): Promise<CareerCategory[]> {
    return this.request<CareerCategory[]>('/career-categories');
  }

  public async getStudentCareerInterests(): Promise<Array<StudentCareerInterest & { career_title: string; category_id: number; category_name: string }>> {
    return this.request<Array<StudentCareerInterest & { career_title: string; category_id: number; category_name: string }>>(
      '/students/me/career-interests'
    );
  }

  public async saveStudentCareerInterests(
    careerIds: number[]
  ): Promise<Array<StudentCareerInterest & { career_title: string; category_id: number; category_name: string }>> {
    return this.request<Array<StudentCareerInterest & { career_title: string; category_id: number; category_name: string }>>(
      '/students/me/career-interests',
      {
        method: 'PUT',
        body: JSON.stringify({ careerIds }),
      }
    );
  }

  public async getCareers(query?: string, categoryId?: number): Promise<Career[]> {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (categoryId) params.set('categoryId', String(categoryId));
    const qs = params.toString();
    return this.request<Career[]>(`/careers${qs ? `?${qs}` : ''}`);
  }

  public async getCareerDetail(careerId: number): Promise<any> {
    return this.request<any>(`/careers/${careerId}`);
  }

  public async getCareerById(careerId: number): Promise<any> {
    return this.getCareerDetail(careerId);
  }

  public async getCareerMarketSummary(careerId: number): Promise<CareerMarketSummary> {
    return this.request<CareerMarketSummary>(`/careers/${careerId}/market-summary`);
  }

  public async getCareerEvidence(careerId: number): Promise<any[]> {
    return this.request<any[]>(`/careers/${careerId}/evidence`);
  }

  // Recommendations & Gap
  public async generateRecommendations(): Promise<any> {
    return this.request<any>('/career-recommendations', { method: 'POST' });
  }

  public async calculateRecommendations(): Promise<any> {
    return this.generateRecommendations();
  }

  public async getLatestRecommendations(): Promise<any> {
    return this.request<any>('/career-recommendations/latest');
  }

  public async getRecommendations(): Promise<any> {
    const res = await this.getLatestRecommendations();
    return res?.results || res?.recommendations || [];
  }

  public async getSkillGap(careerId: number): Promise<SkillGapAnalysis> {
    return this.request<SkillGapAnalysis>(`/careers/${careerId}/skill-gap`);
  }

  public async compareCareers(careerIds: number[]): Promise<any> {
    return this.request<any>('/career-comparisons', {
      method: 'POST',
      body: JSON.stringify({ careerIds }),
    });
  }

  public async getCareerRealityReport(careerId: number): Promise<any> {
    return this.request<any>(`/careers/${careerId}/reality-report`);
  }

  // Admin
  public async getAdminUsers(): Promise<SafeUser[]> {
    return this.request<SafeUser[]>('/admin/users');
  }

  public async setUserStatus(userId: number, status: 'ACTIVE' | 'DISABLED'): Promise<SafeUser> {
    return this.request<SafeUser>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  public async createCareer(data: any): Promise<Career> {
    return this.request<Career>('/admin/careers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async updateCareer(careerId: number, data: any): Promise<Career> {
    return this.request<Career>(`/admin/careers/${careerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async createJobEvidence(data: any): Promise<any> {
    return this.request<any>('/admin/job-evidence', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getAdminDataQuality(): Promise<any> {
    return this.request<any>('/admin/data-quality');
  }

  public async resetDatabase(): Promise<any> {
    return this.request<any>('/admin/reset-database', { method: 'POST' });
  }

  // Notifications
  public async getNotifications(): Promise<AppNotification[]> {
    return this.request<AppNotification[]>('/notifications');
  }

  public async markNotificationAsRead(id: number): Promise<void> {
    return this.request<void>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  public async markAllNotificationsAsRead(): Promise<void> {
    return this.request<void>('/notifications/read-all', { method: 'POST' });
  }

  // ---------------------------------------------------------------------------
  // PathProof Copilot Client Methods
  // ---------------------------------------------------------------------------

  public async sendMessageToCopilot(
    conversationId: number,
    message: string
  ): Promise<{ userMessage: CopilotMessage; assistantMessage: CopilotMessage }> {
    return this.request<{ userMessage: CopilotMessage; assistantMessage: CopilotMessage }>('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ conversationId, message }),
    });
  }

  public async getCopilotConversations(): Promise<CopilotConversation[]> {
    return this.request<CopilotConversation[]>('/copilot/conversations');
  }

  public async createCopilotConversation(title?: string): Promise<CopilotConversation> {
    return this.request<CopilotConversation>('/copilot/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  public async getCopilotConversation(
    id: number
  ): Promise<{ conversation: CopilotConversation; messages: CopilotMessage[] }> {
    return this.request<{ conversation: CopilotConversation; messages: CopilotMessage[] }>(
      `/copilot/conversations/${id}`
    );
  }

  public async deleteCopilotConversation(id: number): Promise<void> {
    return this.request<void>(`/copilot/conversations/${id}`, { method: 'DELETE' });
  }

  public async getCopilotStudentContext(): Promise<any> {
    return this.request<any>('/copilot/context');
  }

  public async confirmCopilotAction(
    actionId: number,
    editedPayload?: RoadmapPayload
  ): Promise<StudentRoadmap> {
    return this.request<StudentRoadmap>('/copilot/actions/confirm', {
      method: 'POST',
      body: JSON.stringify({ actionId, editedPayload }),
    });
  }

  public async getStudentRoadmaps(): Promise<StudentRoadmap[]> {
    return this.request<StudentRoadmap[]>('/copilot/roadmaps');
  }

  public async toggleRoadmapMilestone(milestoneId: number): Promise<StudentRoadmapMilestone> {
    return this.request<StudentRoadmapMilestone>(`/copilot/roadmaps/milestones/${milestoneId}`, {
      method: 'PATCH',
    });
  }
}

export const apiClient = new ApiClient();
