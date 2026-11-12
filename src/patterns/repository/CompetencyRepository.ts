/**
 * PathProof — Competency Repository (Repository Pattern)
 * Encapsulates database operations for competencies and student skill assessments.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';

export interface CompetencyEntity {
  competency_id: number;
  name: string;
  category: string;
  description: string;
  created_at: Date;
}

export interface SkillAssessmentEntity {
  assessment_id: number;
  user_id: number;
  competency_id: number;
  proficiency_level: number;
  notes: string;
  verified_status: 'UNVERIFIED' | 'SELF_REPORTED' | 'PEER_REVIEWED' | 'FACULTY_VERIFIED';
  created_at: Date;
  updated_at: Date;
}

export interface ICompetencyRepository {
  findAll(): Promise<CompetencyEntity[]>;
  findById(competencyId: number): Promise<CompetencyEntity | null>;
  findByName(name: string): Promise<CompetencyEntity | null>;
  create(competency: { name: string; category: string; description?: string }): Promise<CompetencyEntity>;
  getStudentAssessments(userId: number): Promise<Array<SkillAssessmentEntity & { competency_name: string; category: string }>>;
  saveStudentAssessment(userId: number, competencyId: number, proficiencyLevel: number, notes?: string): Promise<boolean>;
}

export class CompetencyRepository implements ICompetencyRepository {
  private db: DatabaseConnectionManager;

  constructor(dbManager?: DatabaseConnectionManager) {
    this.db = dbManager || DatabaseConnectionManager.getInstance();
  }

  async findAll(): Promise<CompetencyEntity[]> {
    return this.db.query<CompetencyEntity>('SELECT * FROM competencies ORDER BY category ASC, name ASC');
  }

  async findById(competencyId: number): Promise<CompetencyEntity | null> {
    const rows = await this.db.query<CompetencyEntity>(
      'SELECT * FROM competencies WHERE competency_id = ? LIMIT 1',
      [competencyId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByName(name: string): Promise<CompetencyEntity | null> {
    const rows = await this.db.query<CompetencyEntity>(
      'SELECT * FROM competencies WHERE LOWER(name) = LOWER(?) LIMIT 1',
      [name.trim()]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(competency: { name: string; category: string; description?: string }): Promise<CompetencyEntity> {
    const result = await this.db.execute(
      'INSERT INTO competencies (name, category, description) VALUES (?, ?, ?)',
      [competency.name.trim(), competency.category.trim(), competency.description || '']
    );

    const inserted = await this.findById(result.insertId);
    if (!inserted) {
      return {
        competency_id: result.insertId,
        name: competency.name.trim(),
        category: competency.category.trim(),
        description: competency.description || '',
        created_at: new Date(),
      };
    }
    return inserted;
  }

  async getStudentAssessments(userId: number): Promise<Array<SkillAssessmentEntity & { competency_name: string; category: string }>> {
    return this.db.query<any>(
      `SELECT sa.*, c.name AS competency_name, c.category
       FROM skill_assessments sa
       JOIN competencies c ON sa.competency_id = c.competency_id
       WHERE sa.user_id = ?
       ORDER BY c.category ASC, c.name ASC`,
      [userId]
    );
  }

  async saveStudentAssessment(userId: number, competencyId: number, proficiencyLevel: number, notes = ''): Promise<boolean> {
    const existing = await this.db.query<any>(
      'SELECT assessment_id FROM skill_assessments WHERE user_id = ? AND competency_id = ? LIMIT 1',
      [userId, competencyId]
    );

    if (existing.length > 0) {
      const result = await this.db.execute(
        'UPDATE skill_assessments SET proficiency_level = ?, notes = ?, updated_at = NOW() WHERE assessment_id = ?',
        [proficiencyLevel, notes, existing[0].assessment_id]
      );
      return result.affectedRows > 0;
    } else {
      const result = await this.db.execute(
        `INSERT INTO skill_assessments (user_id, competency_id, proficiency_level, notes, verified_status)
         VALUES (?, ?, ?, ?, 'SELF_REPORTED')`,
        [userId, competencyId, proficiencyLevel, notes]
      );
      return result.affectedRows > 0;
    }
  }
}
