/**
 * PathProof — Student Repository (Repository Pattern)
 * Encapsulates CRUD operations for student_profiles and student context data.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';

export interface StudentProfileEntity {
  profile_id: number;
  user_id: number;
  university_name: string;
  degree_program: string;
  current_semester: number;
  graduation_year: number;
  weekly_learning_hours: number;
  budget_preference: 'FREE_ONLY' | 'LOW_COST' | 'ANY' | 'NOT_SPECIFIED';
  learning_preference: 'HANDS_ON' | 'THEORETICAL' | 'HYBRID' | 'PROJECT_BASED' | 'NOT_SPECIFIED';
  created_at: Date;
  updated_at: Date;
}

export interface StudentWithProfile {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  profile: StudentProfileEntity | null;
}

export interface IStudentRepository {
  findByUserId(userId: number): Promise<StudentProfileEntity | null>;
  create(profileData: Partial<StudentProfileEntity> & { user_id: number }): Promise<StudentProfileEntity>;
  update(userId: number, updates: Partial<StudentProfileEntity>): Promise<boolean>;
  getStudentWithProfile(userId: number): Promise<StudentWithProfile | null>;
}

export class StudentRepository implements IStudentRepository {
  private db: DatabaseConnectionManager;

  constructor(dbManager?: DatabaseConnectionManager) {
    this.db = dbManager || DatabaseConnectionManager.getInstance();
  }

  async findByUserId(userId: number): Promise<StudentProfileEntity | null> {
    const rows = await this.db.query<StudentProfileEntity>(
      'SELECT * FROM student_profiles WHERE user_id = ? LIMIT 1',
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(profileData: Partial<StudentProfileEntity> & { user_id: number }): Promise<StudentProfileEntity> {
    const university = profileData.university_name || 'NUST Islamabad';
    const degree = profileData.degree_program || 'BS Software Engineering';
    const semester = profileData.current_semester || 5;
    const gradYear = profileData.graduation_year || 2026;
    const hours = profileData.weekly_learning_hours || 15.0;
    const budget = profileData.budget_preference || 'NOT_SPECIFIED';
    const learning = profileData.learning_preference || 'HANDS_ON';

    const result = await this.db.execute(
      `INSERT INTO student_profiles 
       (user_id, university_name, degree_program, current_semester, graduation_year, weekly_learning_hours, budget_preference, learning_preference)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [profileData.user_id, university, degree, semester, gradYear, hours, budget, learning]
    );

    const inserted = await this.findByUserId(profileData.user_id);
    if (!inserted) {
      return {
        profile_id: result.insertId,
        user_id: profileData.user_id,
        university_name: university,
        degree_program: degree,
        current_semester: semester,
        graduation_year: gradYear,
        weekly_learning_hours: hours,
        budget_preference: budget as any,
        learning_preference: learning as any,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }
    return inserted;
  }

  async update(userId: number, updates: Partial<StudentProfileEntity>): Promise<boolean> {
    const existing = await this.findByUserId(userId);
    if (!existing) return false;

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.university_name !== undefined) {
      fields.push('university_name = ?');
      values.push(updates.university_name);
    }
    if (updates.degree_program !== undefined) {
      fields.push('degree_program = ?');
      values.push(updates.degree_program);
    }
    if (updates.current_semester !== undefined) {
      fields.push('current_semester = ?');
      values.push(updates.current_semester);
    }
    if (updates.weekly_learning_hours !== undefined) {
      fields.push('weekly_learning_hours = ?');
      values.push(updates.weekly_learning_hours);
    }
    if (updates.budget_preference !== undefined) {
      fields.push('budget_preference = ?');
      values.push(updates.budget_preference);
    }
    if (updates.learning_preference !== undefined) {
      fields.push('learning_preference = ?');
      values.push(updates.learning_preference);
    }

    if (fields.length === 0) return true;

    values.push(userId);
    const sql = `UPDATE student_profiles SET ${fields.join(', ')} WHERE user_id = ?`;
    const result = await this.db.execute(sql, values);
    return result.affectedRows > 0;
  }

  async getStudentWithProfile(userId: number): Promise<StudentWithProfile | null> {
    const users = await this.db.query<any>(
      'SELECT user_id, full_name, email, role FROM users WHERE user_id = ? LIMIT 1',
      [userId]
    );
    if (users.length === 0) return null;

    const profile = await this.findByUserId(userId);
    return {
      user_id: users[0].user_id,
      full_name: users[0].full_name,
      email: users[0].email,
      role: users[0].role,
      profile,
    };
  }
}
