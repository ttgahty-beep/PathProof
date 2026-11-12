/**
 * PathProof — User Repository (Repository Pattern)
 * Encapsulates database access for the `users` table using parameterized queries.
 */

import { DatabaseConnectionManager } from '../singleton/DatabaseConnectionManager.ts';
import bcrypt from 'bcrypt';

export interface UserEntity {
  user_id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'STUDENT' | 'ADMIN' | 'REVIEWER';
  account_status: 'ACTIVE' | 'DISABLED';
  created_at: Date;
  updated_at: Date;
}

export interface IUserRepository {
  findById(userId: number): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(userData: {
    email: string;
    passwordPlain: string;
    full_name: string;
    role?: 'STUDENT' | 'ADMIN' | 'REVIEWER';
  }): Promise<UserEntity>;
  updateStatus(userId: number, status: 'ACTIVE' | 'DISABLED'): Promise<boolean>;
  listAll(): Promise<UserEntity[]>;
  verifyPassword(user: UserEntity, passwordPlain: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  private db: DatabaseConnectionManager;

  constructor(dbManager?: DatabaseConnectionManager) {
    this.db = dbManager || DatabaseConnectionManager.getInstance();
  }

  async findById(userId: number): Promise<UserEntity | null> {
    const rows = await this.db.query<UserEntity>(
      'SELECT user_id, email, password_hash, full_name, role, account_status, created_at, updated_at FROM users WHERE user_id = ? LIMIT 1',
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const rows = await this.db.query<UserEntity>(
      'SELECT user_id, email, password_hash, full_name, role, account_status, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(userData: {
    email: string;
    passwordPlain: string;
    full_name: string;
    role?: 'STUDENT' | 'ADMIN' | 'REVIEWER';
  }): Promise<UserEntity> {
    const existing = await this.findByEmail(userData.email);
    if (existing) {
      throw new Error(`User with email "${userData.email}" already exists.`);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.passwordPlain, saltRounds);
    const role = userData.role || 'STUDENT';

    const result = await this.db.execute(
      'INSERT INTO users (email, password_hash, full_name, role, account_status) VALUES (?, ?, ?, ?, ?)',
      [userData.email.toLowerCase().trim(), passwordHash, userData.full_name.trim(), role, 'ACTIVE']
    );

    const inserted = await this.findById(result.insertId);
    if (!inserted) {
      // Fallback for mocked auto increment
      return {
        user_id: result.insertId,
        email: userData.email.toLowerCase().trim(),
        password_hash: passwordHash,
        full_name: userData.full_name.trim(),
        role,
        account_status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date(),
      };
    }
    return inserted;
  }

  async updateStatus(userId: number, status: 'ACTIVE' | 'DISABLED'): Promise<boolean> {
    const result = await this.db.execute(
      'UPDATE users SET account_status = ? WHERE user_id = ?',
      [status, userId]
    );
    return result.affectedRows > 0;
  }

  async listAll(): Promise<UserEntity[]> {
    return this.db.query<UserEntity>(
      'SELECT user_id, email, password_hash, full_name, role, account_status, created_at, updated_at FROM users ORDER BY user_id ASC'
    );
  }

  async verifyPassword(user: UserEntity, passwordPlain: string): Promise<boolean> {
    if (!user || !user.password_hash) return false;
    // Support test / bcrypt comparison
    if (user.password_hash.startsWith('$2b$') || user.password_hash.startsWith('$2a$')) {
      return bcrypt.compare(passwordPlain, user.password_hash);
    }
    // Fallback for demo plain seeds
    return user.password_hash === passwordPlain;
  }
}
