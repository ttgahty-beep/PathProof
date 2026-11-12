/**
 * PathProof — Career Repository (Repository Pattern)
 * Encapsulates CRUD operations for career_paths and career_competencies.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';

export interface CareerEntity {
  career_id: number;
  category_name: string;
  career_title: string;
  slug: string;
  summary: string;
  description: string;
  salary_range_pkr: string;
  publication_status: 'DRAFT' | 'PUBLISHED';
  created_at: Date;
  updated_at: Date;
}

export interface CareerWithRequirements extends CareerEntity {
  competencies: Array<{
    competency_id: number;
    name: string;
    category: string;
    target_level: number;
    importance_weight: number;
    requirement_type: 'CORE' | 'ELECTIVE';
  }>;
}

export interface ICareerRepository {
  findAllPublished(): Promise<CareerEntity[]>;
  findById(careerId: number): Promise<CareerEntity | null>;
  findBySlug(slug: string): Promise<CareerWithRequirements | null>;
  create(careerData: Omit<CareerEntity, 'career_id' | 'created_at' | 'updated_at'>): Promise<CareerEntity>;
  addCompetencyRequirement(careerId: number, competencyId: number, targetLevel: number, importanceWeight: number, requirementType: 'CORE' | 'ELECTIVE'): Promise<boolean>;
}

export class CareerRepository implements ICareerRepository {
  private db: DatabaseConnectionManager;

  constructor(dbManager?: DatabaseConnectionManager) {
    this.db = dbManager || DatabaseConnectionManager.getInstance();
  }

  async findAllPublished(): Promise<CareerEntity[]> {
    return this.db.query<CareerEntity>(
      'SELECT * FROM career_paths WHERE publication_status = ? ORDER BY career_title ASC',
      ['PUBLISHED']
    );
  }

  async findById(careerId: number): Promise<CareerEntity | null> {
    const rows = await this.db.query<CareerEntity>(
      'SELECT * FROM career_paths WHERE career_id = ? LIMIT 1',
      [careerId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findBySlug(slug: string): Promise<CareerWithRequirements | null> {
    const rows = await this.db.query<CareerEntity>(
      'SELECT * FROM career_paths WHERE slug = ? LIMIT 1',
      [slug]
    );
    if (rows.length === 0) return null;
    const career = rows[0];

    const requirements = await this.db.query<any>(
      `SELECT cc.competency_id, c.name, c.category, cc.target_level, cc.importance_weight, cc.requirement_type
       FROM career_competencies cc
       JOIN competencies c ON cc.competency_id = c.competency_id
       WHERE cc.career_id = ?`,
      [career.career_id]
    );

    return {
      ...career,
      competencies: requirements || [],
    };
  }

  async create(careerData: Omit<CareerEntity, 'career_id' | 'created_at' | 'updated_at'>): Promise<CareerEntity> {
    const result = await this.db.execute(
      `INSERT INTO career_paths (category_name, career_title, slug, summary, description, salary_range_pkr, publication_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        careerData.category_name,
        careerData.career_title,
        careerData.slug,
        careerData.summary,
        careerData.description || '',
        careerData.salary_range_pkr || 'PKR 80,000 – 140,000',
        careerData.publication_status || 'PUBLISHED',
      ]
    );

    const inserted = await this.findById(result.insertId);
    if (!inserted) {
      return {
        career_id: result.insertId,
        ...careerData,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }
    return inserted;
  }

  async addCompetencyRequirement(
    careerId: number,
    competencyId: number,
    targetLevel: number,
    importanceWeight: number,
    requirementType: 'CORE' | 'ELECTIVE'
  ): Promise<boolean> {
    const result = await this.db.execute(
      `INSERT INTO career_competencies (career_id, competency_id, target_level, importance_weight, requirement_type)
       VALUES (?, ?, ?, ?, ?)`,
      [careerId, competencyId, targetLevel, importanceWeight, requirementType]
    );
    return result.affectedRows > 0;
  }
}
