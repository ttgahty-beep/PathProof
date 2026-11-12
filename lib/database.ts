/**
 * PathProof — lib/database.ts
 * Centralized Database Module (Singleton Pattern)
 * Exposes the singleton connection manager, pool configuration, and transaction helper.
 */

import { DatabaseConnectionManager, getDatabaseManager, DatabaseConfig, QueryResult } from '../src/patterns/singleton/DatabaseConnectionManager.ts';

export { DatabaseConnectionManager, getDatabaseManager };
export type { DatabaseConfig, QueryResult };

/**
 * Convenience query execution wrapper using the Singleton pool
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const dbManager = DatabaseConnectionManager.getInstance();
  return dbManager.query<T>(sql, params);
}

/**
 * Convenience mutation execution wrapper using the Singleton pool
 */
export async function execute(sql: string, params: any[] = []): Promise<QueryResult> {
  const dbManager = DatabaseConnectionManager.getInstance();
  return dbManager.execute(sql, params);
}

/**
 * Convenience transaction wrapper using the Singleton pool
 */
export async function transaction<T>(callback: (connection: {
  query: <R = any>(sql: string, params?: any[]) => Promise<R[]>;
  execute: (sql: string, params?: any[]) => Promise<QueryResult>;
}) => Promise<T>): Promise<T> {
  const dbManager = DatabaseConnectionManager.getInstance();
  return dbManager.transaction<T>(callback);
}

export default DatabaseConnectionManager.getInstance();
