/**
 * PathProof — Notification & Activity Repository (Repository Pattern)
 * Encapsulates database operations for `notifications` and `activity_history`.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';

export interface NotificationEntity {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  reference_id: number | null;
  created_at: Date;
}

export interface ActivityHistoryEntity {
  activity_id: number;
  user_id: number;
  action_type: string;
  entity_type: string;
  entity_id: number | null;
  description: string;
  metadata_json: any;
  created_at: Date;
}

export interface INotificationRepository {
  getUserNotifications(userId: number): Promise<NotificationEntity[]>;
  createNotification(notif: {
    user_id: number;
    title: string;
    message: string;
    notification_type?: string;
    reference_id?: number;
  }): Promise<NotificationEntity>;
  markAsRead(notificationId: number, userId: number): Promise<boolean>;
  recordActivity(activity: {
    user_id: number;
    action_type: string;
    entity_type: string;
    entity_id?: number;
    description: string;
    metadata?: any;
  }): Promise<ActivityHistoryEntity>;
  getUserActivity(userId: number, limit?: number): Promise<ActivityHistoryEntity[]>;
}

export class NotificationRepository implements INotificationRepository {
  private db: DatabaseConnectionManager;

  constructor(dbManager?: DatabaseConnectionManager) {
    this.db = dbManager || DatabaseConnectionManager.getInstance();
  }

  async getUserNotifications(userId: number): Promise<NotificationEntity[]> {
    return this.db.query<NotificationEntity>(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  async createNotification(notif: {
    user_id: number;
    title: string;
    message: string;
    notification_type?: string;
    reference_id?: number;
  }): Promise<NotificationEntity> {
    const res = await this.db.execute(
      `INSERT INTO notifications (user_id, title, message, notification_type, is_read, reference_id)
       VALUES (?, ?, ?, ?, FALSE, ?)`,
      [
        notif.user_id,
        notif.title.trim(),
        notif.message.trim(),
        notif.notification_type || 'SYSTEM',
        notif.reference_id || null,
      ]
    );

    return {
      notification_id: res.insertId,
      user_id: notif.user_id,
      title: notif.title.trim(),
      message: notif.message.trim(),
      notification_type: notif.notification_type || 'SYSTEM',
      is_read: false,
      reference_id: notif.reference_id || null,
      created_at: new Date(),
    };
  }

  async markAsRead(notificationId: number, userId: number): Promise<boolean> {
    const res = await this.db.execute(
      'UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?',
      [notificationId, userId]
    );
    return res.affectedRows > 0;
  }

  async recordActivity(activity: {
    user_id: number;
    action_type: string;
    entity_type: string;
    entity_id?: number;
    description: string;
    metadata?: any;
  }): Promise<ActivityHistoryEntity> {
    const metaStr = activity.metadata ? JSON.stringify(activity.metadata) : null;
    const res = await this.db.execute(
      `INSERT INTO activity_history (user_id, action_type, entity_type, entity_id, description, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        activity.user_id,
        activity.action_type,
        activity.entity_type,
        activity.entity_id || null,
        activity.description.trim(),
        metaStr,
      ]
    );

    return {
      activity_id: res.insertId,
      user_id: activity.user_id,
      action_type: activity.action_type,
      entity_type: activity.entity_type,
      entity_id: activity.entity_id || null,
      description: activity.description.trim(),
      metadata_json: activity.metadata || null,
      created_at: new Date(),
    };
  }

  async getUserActivity(userId: number, limit = 20): Promise<ActivityHistoryEntity[]> {
    return this.db.query<ActivityHistoryEntity>(
      'SELECT * FROM activity_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
  }
}
