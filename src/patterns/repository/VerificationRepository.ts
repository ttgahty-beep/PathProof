/**
 * PathProof — Verification Repository (Repository Pattern)
 * Encapsulates database operations for `reviewers` and `evidence_verifications`.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';
import { VerificationStatus } from '../observer/EvidenceVerificationEvent.ts';

export interface ReviewerEntity {
  reviewer_id: number;
  user_id: number;
  department: string;
  title: string;
  can_verify_academics: boolean;
  can_verify_industry: boolean;
  created_at: Date;
}

export interface VerificationRecordEntity {
  verification_id: number;
  evidence_id: number;
  reviewer_id: number;
  previous_status: VerificationStatus;
  new_status: VerificationStatus;
  feedback: string;
  reviewed_at: Date;
}

export interface IVerificationRepository {
  findReviewerByUserId(userId: number): Promise<ReviewerEntity | null>;
  findReviewerById(reviewerId: number): Promise<ReviewerEntity | null>;
  createReviewer(reviewer: {
    user_id: number;
    department?: string;
    title?: string;
    can_verify_academics?: boolean;
    can_verify_industry?: boolean;
  }): Promise<ReviewerEntity>;
  recordVerification(data: {
    evidence_id: number;
    reviewer_id: number;
    previous_status: VerificationStatus;
    new_status: VerificationStatus;
    feedback: string;
  }): Promise<VerificationRecordEntity>;
  getHistoryForEvidence(evidenceId: number): Promise<VerificationRecordEntity[]>;
}

export class VerificationRepository implements IVerificationRepository {
  private db: DatabaseConnectionManager;

  constructor(dbManager?: DatabaseConnectionManager) {
    this.db = dbManager || DatabaseConnectionManager.getInstance();
  }

  async findReviewerByUserId(userId: number): Promise<ReviewerEntity | null> {
    const rows = await this.db.query<ReviewerEntity>(
      'SELECT * FROM reviewers WHERE user_id = ? LIMIT 1',
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findReviewerById(reviewerId: number): Promise<ReviewerEntity | null> {
    const rows = await this.db.query<ReviewerEntity>(
      'SELECT * FROM reviewers WHERE reviewer_id = ? LIMIT 1',
      [reviewerId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createReviewer(reviewer: {
    user_id: number;
    department?: string;
    title?: string;
    can_verify_academics?: boolean;
    can_verify_industry?: boolean;
  }): Promise<ReviewerEntity> {
    const res = await this.db.execute(
      `INSERT INTO reviewers (user_id, department, title, can_verify_academics, can_verify_industry)
       VALUES (?, ?, ?, ?, ?)`,
      [
        reviewer.user_id,
        reviewer.department || 'Department of Computing',
        reviewer.title || 'Faculty Reviewer',
        reviewer.can_verify_academics !== false,
        reviewer.can_verify_industry !== false,
      ]
    );

    const inserted = await this.findReviewerById(res.insertId);
    if (!inserted) {
      return {
        reviewer_id: res.insertId,
        user_id: reviewer.user_id,
        department: reviewer.department || 'Department of Computing',
        title: reviewer.title || 'Faculty Reviewer',
        can_verify_academics: reviewer.can_verify_academics !== false,
        can_verify_industry: reviewer.can_verify_industry !== false,
        created_at: new Date(),
      };
    }
    return inserted;
  }

  async recordVerification(data: {
    evidence_id: number;
    reviewer_id: number;
    previous_status: VerificationStatus;
    new_status: VerificationStatus;
    feedback: string;
  }): Promise<VerificationRecordEntity> {
    const res = await this.db.execute(
      `INSERT INTO evidence_verifications (evidence_id, reviewer_id, previous_status, new_status, feedback)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.evidence_id,
        data.reviewer_id,
        data.previous_status,
        data.new_status,
        data.feedback.trim(),
      ]
    );

    return {
      verification_id: res.insertId,
      evidence_id: data.evidence_id,
      reviewer_id: data.reviewer_id,
      previous_status: data.previous_status,
      new_status: data.new_status,
      feedback: data.feedback.trim(),
      reviewed_at: new Date(),
    };
  }

  async getHistoryForEvidence(evidenceId: number): Promise<VerificationRecordEntity[]> {
    return this.db.query<VerificationRecordEntity>(
      'SELECT * FROM evidence_verifications WHERE evidence_id = ? ORDER BY reviewed_at DESC',
      [evidenceId]
    );
  }
}
