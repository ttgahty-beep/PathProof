/**
 * PathProof — Real MySQL Schema Provisioning & Safe Seed Script (lib/db-setup.ts)
 * Uses the Singleton DatabaseConnectionManager (preserving host, credentials, and SSL config)
 * to create `pathproof_db`, execute `sql/schema.sql`, conditionally execute `sql/seed.sql`
 * ONLY when `pathproof_db` is completely empty, verify all 15 tables in `information_schema.tables`,
 * and test real SELECT queries against `users` and `career_paths`.
 *
 * Usage: npx tsx lib/db-setup.ts
 */

import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseConnectionManager } from '../src/patterns/singleton/DatabaseConnectionManager.ts';
import { EXPECTED_TABLES } from './db-test.ts';

dotenv.config();

/**
 * Splits a SQL script into individual executable statements while respecting
 * string literals ('...', "..."), backticks (`...`), `--` comments, and `/* ... *\/` comments.
 */
export function splitSqlStatements(sqlContent: string): string[] {
  const statements: string[] = [];
  let current = '';
  let i = 0;
  const len = sqlContent.length;

  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;

  while (i < len) {
    const ch = sqlContent[i];
    const next = i + 1 < len ? sqlContent[i + 1] : '';

    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false;
        current += ch;
      }
      i++;
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if (ch === '-' && next === '-' && (i + 2 >= len || /\s/.test(sqlContent[i + 2]))) {
        inLineComment = true;
        i += 2;
        continue;
      }
      if (ch === '#') {
        inLineComment = true;
        i++;
        continue;
      }
      if (ch === '/' && next === '*') {
        inBlockComment = true;
        i += 2;
        continue;
      }
    }

    if (inSingleQuote) {
      current += ch;
      if (ch === '\\' && i + 1 < len) {
        current += next;
        i += 2;
        continue;
      }
      if (ch === "'" && next === "'") {
        current += next;
        i += 2;
        continue;
      }
      if (ch === "'") {
        inSingleQuote = false;
      }
      i++;
      continue;
    }

    if (inDoubleQuote) {
      current += ch;
      if (ch === '\\' && i + 1 < len) {
        current += next;
        i += 2;
        continue;
      }
      if (ch === '"') {
        inDoubleQuote = false;
      }
      i++;
      continue;
    }

    if (inBacktick) {
      current += ch;
      if (ch === '`') {
        inBacktick = false;
      }
      i++;
      continue;
    }

    if (ch === "'") {
      inSingleQuote = true;
      current += ch;
      i++;
      continue;
    }

    if (ch === '"') {
      inDoubleQuote = true;
      current += ch;
      i++;
      continue;
    }

    if (ch === '`') {
      inBacktick = true;
      current += ch;
      i++;
      continue;
    }

    if (ch === ';') {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      current = '';
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  const tail = current.trim();
  if (tail.length > 0) {
    statements.push(tail);
  }

  return statements;
}

export function validateSeedScriptSafety(statements: string[], targetDatabase: string): {
  safe: boolean;
  reason: string;
} {
  if (statements.length === 0) {
    return { safe: false, reason: 'seed.sql contains no executable SQL statements.' };
  }

  const allowedTables = new Set<string>(EXPECTED_TABLES);
  const forbiddenPattern = /\b(DROP\s+DATABASE|DROP\s+SCHEMA|DROP\s+TABLE|DELETE\s+FROM|ALTER\s+TABLE|CREATE\s+USER|GRANT\s+)\b/i;

  for (const stmt of statements) {
    if (forbiddenPattern.test(stmt)) {
      return {
        safe: false,
        reason: `Unsafe SQL statement detected in seed.sql: "${stmt.slice(0, 60)}..."`,
      };
    }

    const useMatch = stmt.match(/^USE\s+[`"]?([a-zA-Z0-9_]+)[`"]?$/i);
    if (useMatch && useMatch[1] !== targetDatabase) {
      return {
        safe: false,
        reason: `seed.sql targets database "${useMatch[1]}" instead of "${targetDatabase}".`,
      };
    }

    const truncateMatch = stmt.match(/^TRUNCATE\s+(?:TABLE\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?$/i);
    if (truncateMatch && !allowedTables.has(truncateMatch[1])) {
      return {
        safe: false,
        reason: `seed.sql attempts to truncate unexpected table "${truncateMatch[1]}".`,
      };
    }

    const insertMatch = stmt.match(/^INSERT\s+INTO\s+[`"]?([a-zA-Z0-9_]+)[`"]?/i);
    if (insertMatch && !allowedTables.has(insertMatch[1])) {
      return {
        safe: false,
        reason: `seed.sql attempts to insert into unexpected table "${insertMatch[1]}".`,
      };
    }
  }

  return { safe: true, reason: 'All statements in seed.sql target only the 15 PathProof tables in pathproof_db.' };
}

export interface SetupAndVerifyResult {
  timestamp: string;
  targetDatabase: string;
  host: string;
  port: number;
  sslEnabled: boolean;
  sslCaConfigured: boolean;
  sslSession: {
    sslVersion: string | null;
    activeCipher: string | null;
  };
  schemaExecution: {
    executed: boolean;
    statementsExecuted: number;
  };
  preSeedRowCounts: Record<string, number>;
  totalRowsBeforeSeed: number;
  seedExecution: {
    safeToRun: boolean;
    safetyReason: string;
    executed: boolean;
    skippedReason?: string;
    statementsExecuted: number;
  };
  tablesVerification: {
    expectedCount: number;
    foundCount: number;
    allPresent: boolean;
    tables: Array<{
      tableName: string;
      exists: boolean;
      engine: string | null;
      exactRowCount: number | null;
    }>;
  };
  poolVerification: {
    select1Passed: boolean;
    activeDatabase: string | null;
    serverVersion: string | null;
    usersQuery: {
      rowCount: number;
      rows: Array<{
        user_id: number;
        email: string;
        full_name: string;
        role: string;
        account_status: string;
      }>;
    };
    careerPathsQuery: {
      rowCount: number;
      rows: Array<{
        career_id: number;
        category_name: string;
        career_title: string;
        slug: string;
        publication_status: string;
      }>;
    };
  };
}

export async function initializeAndVerifyPathProofDb(): Promise<SetupAndVerifyResult> {
  const dbManager = DatabaseConnectionManager.getInstance();
  const config = dbManager.getConfig();

  if (config.database !== 'pathproof_db') {
    throw new Error(`Expected database configuration to target "pathproof_db", got "${config.database}".`);
  }

  const schemaPath = path.resolve(process.cwd(), 'sql', 'schema.sql');
  const seedPath = path.resolve(process.cwd(), 'sql', 'seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  const schemaStatements = splitSqlStatements(schemaSql);
  const seedStatements = splitSqlStatements(seedSql);

  const seedSafety = validateSeedScriptSafety(seedStatements, config.database);

  const conn = await dbManager.createBootstrapConnection(false);

  let sslVersion: string | null = null;
  let activeCipher: string | null = null;
  let schemaStatementsExecuted = 0;
  let seedStatementsExecuted = 0;
  let seedExecuted = false;
  let skippedReason: string | undefined = undefined;
  const preSeedRowCounts: Record<string, number> = {};
  let totalRowsBeforeSeed = 0;

  try {
    // Capture active SSL session details
    try {
      const [sslRows] = await conn.query<any[]>("SHOW SESSION STATUS WHERE Variable_name IN ('Ssl_cipher', 'Ssl_version')");
      for (const r of sslRows) {
        if (r.Variable_name === 'Ssl_cipher') activeCipher = r.Value || null;
        if (r.Variable_name === 'Ssl_version') sslVersion = r.Value || null;
      }
    } catch {
      // ignore if restricted
    }

    // 1. Execute sql/schema.sql against pathproof_db
    for (const stmt of schemaStatements) {
      await conn.query(stmt);
      schemaStatementsExecuted++;
    }

    // Explicitly switch session to pathproof_db
    await conn.query('USE `pathproof_db`');

    // 2. Check exact row counts across all 15 tables before deciding on seeding
    for (const tableName of EXPECTED_TABLES) {
      const [countRows] = await conn.query<any[]>(`SELECT COUNT(*) AS cnt FROM \`pathproof_db\`.\`${tableName}\``);
      const cnt = Number(countRows?.[0]?.cnt || 0);
      preSeedRowCounts[tableName] = cnt;
      totalRowsBeforeSeed += cnt;
    }

    // 3. Execute seed.sql ONLY if database is completely empty and safe
    if (!seedSafety.safe) {
      skippedReason = `Skipped seed.sql: ${seedSafety.reason}`;
    } else if (totalRowsBeforeSeed > 0) {
      skippedReason = `Skipped seed.sql: pathproof_db already contains ${totalRowsBeforeSeed} total row(s); database is not empty.`;
    } else {
      for (const stmt of seedStatements) {
        await conn.query(stmt);
        seedStatementsExecuted++;
      }
      seedExecuted = true;
    }
  } finally {
    await conn.end();
  }

  // 4. Verify using the Singleton pool configured with DB_NAME=pathproof_db
  const pool = dbManager.getPool();
  if (!pool) {
    throw new Error('DatabaseConnectionManager Singleton pool is null.');
  }

  const [select1Rows] = await pool.query<any[]>('SELECT 1 AS ok, VERSION() AS server_version, DATABASE() AS active_db');
  const select1Row = Array.isArray(select1Rows) && select1Rows.length > 0 ? select1Rows[0] : null;

  // 5. Verify all 15 tables via information_schema.tables + exact COUNT(*)
  const verifiedTables: SetupAndVerifyResult['tablesVerification']['tables'] = [];
  let foundCount = 0;

  for (const tableName of EXPECTED_TABLES) {
    const [infoRows] = await pool.query<any[]>(
      `SELECT TABLE_NAME, ENGINE
       FROM information_schema.tables
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
       LIMIT 1`,
      [config.database, tableName]
    );

    if (Array.isArray(infoRows) && infoRows.length > 0) {
      const [cntRows] = await pool.query<any[]>(`SELECT COUNT(*) AS cnt FROM \`${tableName}\``);
      const exactRowCount = Number(cntRows?.[0]?.cnt || 0);
      foundCount++;
      verifiedTables.push({
        tableName,
        exists: true,
        engine: infoRows[0].ENGINE || null,
        exactRowCount,
      });
    } else {
      verifiedTables.push({
        tableName,
        exists: false,
        engine: null,
        exactRowCount: null,
      });
    }
  }

  // 6. Test real SELECT queries against users and career_paths
  const [userRows] = await pool.query<any[]>(
    'SELECT user_id, email, full_name, role, account_status FROM users ORDER BY user_id ASC'
  );
  const [careerRows] = await pool.query<any[]>(
    'SELECT career_id, category_name, career_title, slug, publication_status FROM career_paths ORDER BY career_id ASC'
  );

  return {
    timestamp: new Date().toISOString(),
    targetDatabase: config.database,
    host: config.host,
    port: config.port,
    sslEnabled: config.sslEnabled,
    sslCaConfigured: config.sslCaConfigured,
    sslSession: {
      sslVersion,
      activeCipher,
    },
    schemaExecution: {
      executed: true,
      statementsExecuted: schemaStatementsExecuted,
    },
    preSeedRowCounts,
    totalRowsBeforeSeed,
    seedExecution: {
      safeToRun: seedSafety.safe,
      safetyReason: seedSafety.reason,
      executed: seedExecuted,
      skippedReason,
      statementsExecuted: seedStatementsExecuted,
    },
    tablesVerification: {
      expectedCount: EXPECTED_TABLES.length,
      foundCount,
      allPresent: foundCount === EXPECTED_TABLES.length,
      tables: verifiedTables,
    },
    poolVerification: {
      select1Passed: Boolean(select1Row && Number(select1Row.ok) === 1),
      activeDatabase: select1Row?.active_db || null,
      serverVersion: select1Row?.server_version || null,
      usersQuery: {
        rowCount: Array.isArray(userRows) ? userRows.length : 0,
        rows: Array.isArray(userRows) ? userRows : [],
      },
      careerPathsQuery: {
        rowCount: Array.isArray(careerRows) ? careerRows.length : 0,
        rows: Array.isArray(careerRows) ? careerRows : [],
      },
    },
  };
}

// CLI execution entrypoint
if (
  (typeof process !== 'undefined' && process.argv[1] && process.argv[1].includes('db-setup')) ||
  (typeof import.meta !== 'undefined' && import.meta.url && process.argv[1] && import.meta.url.endsWith(process.argv[1]))
) {
  initializeAndVerifyPathProofDb()
    .then(async (res) => {
      console.log(JSON.stringify(res, null, 2));
      await DatabaseConnectionManager.getInstance().close();
      process.exit(res.tablesVerification.allPresent && res.poolVerification.select1Passed ? 0 : 1);
    })
    .catch(async (err) => {
      console.error('[db-setup] Setup failed:', err?.message || err);
      await DatabaseConnectionManager.getInstance().close();
      process.exit(1);
    });
}
