/**
 * PathProof — Roadmap Repository (Repository Pattern)
 * Encapsulates database operations for `roadmap_items`.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';

export interface RoadmapItemEntity {
  item_id: number;
  user_id: number;
  career_id: number;
  title: string;
  description: string;
  target_week: number;
  estimated_hours: number;
  deliverable: string;
  is_completed: boolean;
  completed_at: Date | null;
  created_at: Date;
}

export interface IRoadmapRepository {
  findByUserIdAndCareer(userId: number, careerId: number): Promise<RoadmapItemEntity[]>;
  findById(itemId: number): Promise<RoadmapItemEntity | null>;
  create(item: {
    user_id: number;
    career_id: number;
    title: string;
    description?: string;
    target_week: number;
    estimated_hours?: number;
    deliverable?: string;
  }): Promise<RoadmapItemEntity>;
  markCompleted(itemId: number, userId: number, isCompleted: boolean): Promise<boolean>;
  delete(itemId: number, userId: number): Promise<boolean>;
}

export class RoadmapRepository implements IRoadmapRepository {
  private db: DatabaseConnectionManager;

  constructor(dbManager?: DatabaseConnectionManager) {
    this.db = dbManager || DatabaseConnectionManager.getInstance();
  }

  async findByUserIdAndCareer(userId: number, careerId: number): Promise<RoadmapItemEntity[]> {
    return this.db.query<RoadmapItemEntity>(
      'SELECT * FROM roadmap_items WHERE user_id = ? AND career_id = ? ORDER BY target_week ASC',
      [userId, careerId]
    );
  }

  async findById(itemId: number): Promise<RoadmapItemEntity | null> {
    const rows = await this.db.query<RoadmapItemEntity>(
      'SELECT * FROM roadmap_items WHERE item_id = ? LIMIT 1',
      [itemId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(item: {
    user_id: number;
    career_id: number;
    title: string;
    description?: string;
    target_week: number;
    estimated_hours?: number;
    deliverable?: string;
  }): Promise<RoadmapItemEntity> {
    const res = await this.db.execute(
      `INSERT INTO roadmap_items (user_id, career_id, title, description, target_week, estimated_hours, deliverable, is_completed)
       VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)`,
      [
        item.user_id,
        item.career_id,
        item.title.trim(),
        item.description?.trim() || '',
        item.target_week,
        item.estimated_hours || 8.0,
        item.deliverable?.trim() || '',
      ]
    );

    const inserted = await this.findById(res.insertId);
    if (!inserted) {
      return {
        item_id: res.insertId,
        user_id: item.user_id,
        career_id: item.career_id,
        title: item.title.trim(),
        description: item.description?.trim() || '',
        target_week: item.target_week,
        estimated_hours: item.estimated_hours || 8.0,
        deliverable: item.deliverable?.trim() || '',
        is_completed: false,
        completed_at: null,
        created_at: new Date(),
      };
    }
    return inserted;
  }

  async markCompleted(itemId: number, userId: number, isCompleted: boolean): Promise<boolean> {
    const existing = await this.findById(itemId);
    if (!existing || existing.user_id !== userId) return false;

    const res = await this.db.execute(
      'UPDATE roadmap_items SET is_completed = ?, completed_at = ? WHERE item_id = ?',
      [isCompleted ? 1 : 0, isCompleted ? new Date() : null, itemId]
    );
    return res.affectedRows > 0;
  }

  async delete(itemId: number, userId: number): Promise<boolean> {
    const existing = await this.findById(itemId);
    if (!existing || existing.user_id !== userId) return false;

    const res = await this.db.execute(
      'DELETE FROM roadmap_items WHERE item_id = ?',
      [itemId]
    );
    return res.affectedRows > 0;
  }
}
