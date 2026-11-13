/**
 * PathProof — Real MySQL Diagnostic Script (lib/db-test.ts)
 * Imports the Singleton DatabaseConnectionManager, executes a real `SELECT 1` query
 * using the mysql2 connection pool (no mock fallback), checks SSL/TLS configuration,
 * and iterates through querying `information_schema.tables` for all 15 expected tables.
 *
 * Usage: npx tsx lib/db-test.ts
 */

import dotenv from 'dotenv';
import { DatabaseConnectionManager } from '../src/patterns/singleton/DatabaseConnectionManager.ts';

dotenv.config();

export const EXPECTED_TABLES = [
  'users',
  'student_profiles',
  'career_paths',
  'competencies',
  'career_competencies',
  'skill_assessments',
  'evidence_items',
  'evidence_skills',
  'reviewers',
  'evidence_verifications',
  'roadmap_items',
  'notifications',
  'activity_history',
  'copilot_conversations',
  'copilot_messages',
] as const;

export interface TableCheckResult {
  tableName: string;
  exists: boolean;
  engine: string | null;
  tableRows: number | null;
  error?: string;
}

export interface DatabaseDiagnosticReport {
  timestamp: string;
  target: {
    host: string;
    port: number;
    database: string;
    sslEnabledInConfig: boolean;
    sslCaConfigured: boolean;
    sslCaValidPem: boolean;
    sslCaIsCa?: boolean;
    sslCaParseError?: string;
    isAivenHost: boolean;
  };
  select1Check: {
    passed: boolean;
    result: any;
    latencyMs: number;
    errorCode?: string;
    errorMessage?: string;
  };
  sslSessionCheck: {
    activeCipher: string | null;
    sslVersion: string | null;
    caCertificateMissingWarning: boolean;
    guidance: string;
  };
  tablesCheck: {
    expectedCount: number;
    foundCount: number;
    missingCount: number;
    allPresent: boolean;
    results: TableCheckResult[];
  };
}

export async function runDatabaseDiagnostics(options: { logToConsole?: boolean } = {}): Promise<DatabaseDiagnosticReport> {
  const log = options.logToConsole !== false;
  const dbManager = DatabaseConnectionManager.getInstance();
  const config = dbManager.getConfig();
  const pool = dbManager.getPool();
  const isAivenHost = config.host.includes('aivencloud.com');

  const report: DatabaseDiagnosticReport = {
    timestamp: new Date().toISOString(),
    target: {
      host: config.host,
      port: config.port,
      database: config.database,
      sslEnabledInConfig: config.sslEnabled,
      sslCaConfigured: config.sslCaConfigured,
      sslCaValidPem: config.sslCaValidPem,
      sslCaIsCa: config.sslCaIsCa,
      sslCaParseError: config.sslCaParseError,
      isAivenHost,
    },
    select1Check: {
      passed: false,
      result: null,
      latencyMs: 0,
    },
    sslSessionCheck: {
      activeCipher: null,
      sslVersion: null,
      caCertificateMissingWarning: isAivenHost && !config.sslCaConfigured,
      guidance: '',
    },
    tablesCheck: {
      expectedCount: EXPECTED_TABLES.length,
      foundCount: 0,
      missingCount: EXPECTED_TABLES.length,
      allPresent: false,
      results: [],
    },
  };

  if (log) {
    console.log('======================================================================');
    console.log(' PathProof Real MySQL Connection & Schema Diagnostic');
    console.log('======================================================================');
    console.log(` Target Host     : ${config.host}:${config.port}`);
    console.log(` Target Database : ${config.database}`);
    console.log(` SSL Configured  : ${config.sslEnabled ? 'YES' : 'NO (Opportunistic/Default)'}`);
    console.log(` SSL CA Cert Set : ${config.sslCaConfigured ? 'YES' : 'NO'}`);
    console.log('----------------------------------------------------------------------');
  }

  if (!pool) {
    report.select1Check.errorCode = 'POOL_UNINITIALIZED';
    report.select1Check.errorMessage = 'DatabaseConnectionManager pool is null.';
    if (log) {
      console.error('❌ [FAIL] Pool Check: DatabaseConnectionManager.getPool() returned null.');
    }
    return report;
  }

  // 1. Execute real SELECT 1 directly on the pool (bypassing mock fallback)
  const start = Date.now();
  try {
    const [rows] = await pool.query('SELECT 1 AS ok, VERSION() AS server_version, DATABASE() AS active_db');
    report.select1Check.latencyMs = Date.now() - start;
    report.select1Check.passed = true;
    report.select1Check.result = Array.isArray(rows) && rows.length > 0 ? rows[0] : rows;
    if (log) {
      console.log(`✅ [PASS] SELECT 1 executed in ${report.select1Check.latencyMs}ms ->`, report.select1Check.result);
    }
  } catch (err: any) {
    report.select1Check.latencyMs = Date.now() - start;
    report.select1Check.passed = false;
    report.select1Check.errorCode = err?.code || 'QUERY_ERROR';
    report.select1Check.errorMessage = err?.message || String(err);

    if (log) {
      console.error(`❌ [FAIL] SELECT 1 failed (${report.select1Check.errorCode}): ${report.select1Check.errorMessage}`);
    }

    if (
      report.select1Check.errorCode === 'HANDSHAKE_SSL_ERROR' ||
      report.select1Check.errorCode === 'SELF_SIGNED_CERT_IN_CHAIN' ||
      report.select1Check.errorCode === 'ERR_TLS_CERT_ALTNAME_INVALID' ||
      (report.select1Check.errorMessage || '').toLowerCase().includes('ssl')
    ) {
      report.sslSessionCheck.caCertificateMissingWarning = true;
      report.sslSessionCheck.guidance =
        'SSL connection failed. Set MYSQL_SSL_CA to your Aiven ca.pem certificate (or file path) and MYSQL_SSL="true" in Secrets/.env.';
      if (log) {
        console.error(`⚠️  [SSL] ${report.sslSessionCheck.guidance}`);
      }
    }

    // Cannot proceed to table checks if SELECT 1 failed
    report.tablesCheck.results = EXPECTED_TABLES.map((tableName) => ({
      tableName,
      exists: false,
      engine: null,
      tableRows: null,
      error: 'Skipped because SELECT 1 connection failed.',
    }));
    return report;
  }

  // 2. Check active TLS / SSL cipher on the connection
  try {
    const [sslRows] = await pool.query<any[]>("SHOW SESSION STATUS WHERE Variable_name IN ('Ssl_cipher', 'Ssl_version')");
    if (Array.isArray(sslRows)) {
      for (const row of sslRows) {
        if (row.Variable_name === 'Ssl_cipher') report.sslSessionCheck.activeCipher = row.Value || null;
        if (row.Variable_name === 'Ssl_version') report.sslSessionCheck.sslVersion = row.Value || null;
      }
    }
  } catch {
    // Non-fatal if SHOW STATUS is restricted
  }

  if (isAivenHost && !config.sslCaConfigured) {
    report.sslSessionCheck.caCertificateMissingWarning = true;
    report.sslSessionCheck.guidance =
      `Connected${report.sslSessionCheck.activeCipher ? ` using ${report.sslSessionCheck.sslVersion} (${report.sslSessionCheck.activeCipher})` : ''}, ` +
      `but Aiven CA certificate verification is not configured. To enforce strict CA verification (ssl-mode=VERIFY_CA), ` +
      `download ca.pem from the Aiven Console and set MYSQL_SSL_CA (file path or PEM string) and MYSQL_SSL="true".`;
  } else if (config.sslCaConfigured) {
    report.sslSessionCheck.guidance = `Verified SSL/TLS active (${report.sslSessionCheck.sslVersion || 'TLS'} / ${report.sslSessionCheck.activeCipher || 'cipher'}).`;
  } else {
    report.sslSessionCheck.guidance = report.sslSessionCheck.activeCipher
      ? `TLS active (${report.sslSessionCheck.sslVersion} / ${report.sslSessionCheck.activeCipher}).`
      : 'Plaintext connection (no SSL cipher active).';
  }

  if (log) {
    if (report.sslSessionCheck.caCertificateMissingWarning) {
      console.warn(`⚠️  [SSL WARNING] ${report.sslSessionCheck.guidance}`);
    } else {
      console.log(`✅ [PASS] SSL/TLS Status: ${report.sslSessionCheck.guidance}`);
    }
    console.log('----------------------------------------------------------------------');
    console.log(` Checking ${EXPECTED_TABLES.length} expected tables in information_schema.tables (schema="${config.database}"):`);
  }

  // 3. Iterate through each of the 15 expected tables in information_schema.tables
  const results: TableCheckResult[] = [];
  for (const tableName of EXPECTED_TABLES) {
    try {
      const [rows] = await pool.query<any[]>(
        `SELECT TABLE_NAME, ENGINE, TABLE_ROWS
         FROM information_schema.tables
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
         LIMIT 1`,
        [config.database, tableName]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0];
        const tableRes: TableCheckResult = {
          tableName,
          exists: true,
          engine: row.ENGINE || null,
          tableRows: row.TABLE_ROWS !== null && row.TABLE_ROWS !== undefined ? Number(row.TABLE_ROWS) : 0,
        };
        results.push(tableRes);
        report.tablesCheck.foundCount++;
        if (log) {
          console.log(`  ✅ [EXISTS]  ${tableName.padEnd(25)} (Engine: ${tableRes.engine}, Rows: ${tableRes.tableRows})`);
        }
      } else {
        const tableRes: TableCheckResult = {
          tableName,
          exists: false,
          engine: null,
          tableRows: null,
        };
        results.push(tableRes);
        if (log) {
          console.error(`  ❌ [MISSING] ${tableName.padEnd(25)} (Not found in schema "${config.database}")`);
        }
      }
    } catch (err: any) {
      results.push({
        tableName,
        exists: false,
        engine: null,
        tableRows: null,
        error: err?.message || String(err),
      });
      if (log) {
        console.error(`  ❌ [ERROR]   ${tableName.padEnd(25)} (${err?.message || err})`);
      }
    }
  }

  report.tablesCheck.results = results;
  report.tablesCheck.missingCount = EXPECTED_TABLES.length - report.tablesCheck.foundCount;
  report.tablesCheck.allPresent = report.tablesCheck.foundCount === EXPECTED_TABLES.length;

  if (log) {
    console.log('----------------------------------------------------------------------');
    console.log(
      ` Summary: ${report.tablesCheck.foundCount}/${report.tablesCheck.expectedCount} tables present, ${report.tablesCheck.missingCount} missing.`
    );
    console.log('======================================================================');
  }

  return report;
}

// Execute when run directly as a CLI script
if (
  (typeof process !== 'undefined' && process.argv[1] && process.argv[1].includes('db-test')) ||
  (typeof import.meta !== 'undefined' && import.meta.url && process.argv[1] && import.meta.url.endsWith(process.argv[1]))
) {
  runDatabaseDiagnostics({ logToConsole: true })
    .then(async (report) => {
      await DatabaseConnectionManager.getInstance().close();
      process.exit(report.select1Check.passed && report.tablesCheck.allPresent ? 0 : 1);
    })
    .catch(async (err) => {
      console.error('[db-test] Fatal diagnostic error:', err);
      await DatabaseConnectionManager.getInstance().close();
      process.exit(1);
    });
}
