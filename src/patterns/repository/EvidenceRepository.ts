/**
 * PathProof — Evidence Repository (Repository Pattern)
 * Encapsulates database operations for `evidence_items` and `evidence_skills`.
 * Enforces ownership checks and relational integrity.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';
import { EvidenceType } from '../factory/EvidenceFactory.ts';
import { VerificationStatus } from '../observer/EvidenceVerificationEvent.ts';

export interface EvidenceItemEntity {
  evidence_id: number;
  user_id: number;
  title: string;
  description: string;
  evidence_type: EvidenceType;
  external_url: string | null;
  verification_status: VerificationStatus;
  created_at: Date;
  updated_at: Date;
}

export interface EvidenceWithSkills extends EvidenceItemEntity {
  skills: Array<{
    competency_id: number;
    competency_name: string;
    claimed_level: number;
  }>;
}

export interface IEvidenceRepository {
  findById(evidenceId: number): Promise<EvidenceItemEntity | null>;
  findWithSkills(evidenceId: number): Promise<EvidenceWithSkills | null>;
  findByUserId(userId: number): Promise<EvidenceItemEntity[]>;
  create(evidenceData: {
    user_id: number;
    title: string;
    description: string;
    evidence_type: EvidenceType;
    external_url?: string;
    claimed_skills?: { competency_id: number; claimed_level: number }[];
  }): Promise<EvidenceWithSkills>;
  update(evidenceId: number, userId: number, updates: {
    title?: string;
    description?: string;
    external_url?: string;
  }): Promise<boolean>;
  updateVerificationStatus(evidenceId: number, status: VerificationStatus): Promise<boolean>;
  delete(evidenceId: number, userId: number): Promise<boolean>;
  listPendingVerification(): Promise<EvidenceItemEntity[]>;
}

export class EvidenceRepository implements IEvidenceRepository {
  private db: DatabaseConnectionManager;

  constructor(dbManager?: DatabaseConnectionManager) {
    this.db = dbManager || DatabaseConnectionManager.getInstance();
  }

  async findById(evidenceId: number): Promise<EvidenceItemEntity | null> {
    const rows = await this.db.query<EvidenceItemEntity>(
      'SELECT * FROM evidence_items WHERE evidence_id = ? LIMIT 1',
      [evidenceId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findWithSkills(evidenceId: number): Promise<EvidenceWithSkills | null> {
    const item = await this.findById(evidenceId);
    if (!item) return null;

    const skills = await this.db.query<any>(
      `SELECT es.competency_id, c.name AS competency_name, es.claimed_level
       FROM evidence_skills es
       JOIN competencies c ON es.competency_id = c.competency_id
       WHERE es.evidence_id = ?`,
      [evidenceId]
    );

    return {
      ...item,
      skills: skills || [],
    };
  }

  async findByUserId(userId: number): Promise<EvidenceItemEntity[]> {
    return this.db.query<EvidenceItemEntity>(
      'SELECT * FROM evidence_items WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  async create(evidenceData: {
    user_id: number;
    title: string;
    description: string;
    evidence_type: EvidenceType;
    external_url?: string;
    claimed_skills?: { competency_id: number; claimed_level: number }[];
  }): Promise<EvidenceWithSkills> {
    return this.db.transaction<EvidenceWithSkills>(async (tx) => {
      const res = await tx.execute(
        `INSERT INTO evidence_items (user_id, title, description, evidence_type, external_url, verification_status)
         VALUES (?, ?, ?, ?, ?, 'PENDING')`,
        [
          evidenceData.user_id,
          evidenceData.title.trim(),
          evidenceData.description.trim(),
          evidenceData.evidence_type,
          evidenceData.external_url?.trim() || null,
        ]
      );

      const evidenceId = res.insertId;

      if (evidenceData.claimed_skills && evidenceData.claimed_skills.length > 0) {
        for (const s of evidenceData.claimed_skills) {
          await tx.execute(
            'INSERT INTO evidence_skills (evidence_id, competency_id, claimed_level) VALUES (?, ?, ?)',
            [evidenceId, s.competency_id, s.claimed_level || 2]
          );
        }
      }

      return {
        evidence_id: evidenceId,
        user_id: evidenceData.user_id,
        title: evidenceData.title.trim(),
        description: evidenceData.description.trim(),
        evidence_type: evidenceData.evidence_type,
        external_url: evidenceData.external_url?.trim() || null,
        verification_status: 'PENDING',
        created_at: new Date(),
        updated_at: new Date(),
        skills: (evidenceData.claimed_skills || []).map((s) => ({
          competency_id: s.competency_id,
          competency_name: `Skill #${s.competency_id}`,
          claimed_level: s.claimed_level || 2,
        })),
      };
    });
  }

  async update(evidenceId: number, userId: number, updates: {
    title?: string;
    description?: string;
    external_url?: string;
  }): Promise<boolean> {
    const existing = await this.findById(evidenceId);
    if (!existing) {
      throw new Error(`Evidence item #${evidenceId} not found.`);
    }
    // Student ownership guard
    if (existing.user_id !== userId) {
      throw new Error(`Security Violation: Student #${userId} cannot modify Evidence #${evidenceId} owned by Student #${existing.user_id}.`);
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title.trim());
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description.trim());
    }
    if (updates.external_url !== undefined) {
      fields.push('external_url = ?');
      values.push(updates.external_url.trim() || null);
    }

    if (fields.length === 0) return true;

    values.push(evidenceId);
    const sql = `UPDATE evidence_items SET ${fields.join(', ')}, updated_at = NOW() WHERE evidence_id = ?`;
    const res = await this.db.execute(sql, values);
    return res.affectedRows > 0;
  }

  async updateVerificationStatus(evidenceId: number, status: VerificationStatus): Promise<boolean> {
    const res = await this.db.execute(
      'UPDATE evidence_items SET verification_status = ?, updated_at = NOW() WHERE evidence_id = ?',
      [status, evidenceId]
    );
    return res.affectedRows > 0;
  }

  async delete(evidenceId: number, userId: number): Promise<boolean> {
    const existing = await this.findById(evidenceId);
    if (!existing) return false;

    // Student ownership check
    if (existing.user_id !== userId) {
      throw new Error(`Security Violation: Student #${userId} cannot delete Evidence #${evidenceId} belonging to another user.`);
    }

    const res = await this.db.execute(
      'DELETE FROM evidence_items WHERE evidence_id = ?',
      [evidenceId]
    );
    return res.affectedRows > 0;
  }

  async listPendingVerification(): Promise<EvidenceItemEntity[]> {
    return this.db.query<EvidenceItemEntity>(
      'SELECT * FROM evidence_items WHERE verification_status = ? ORDER BY created_at ASC',
      ['PENDING']
    );
  }
}
