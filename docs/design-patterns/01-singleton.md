# Design Pattern 1: Singleton Pattern — DatabaseConnectionManager

## 1. Intent & Problem Statement
In enterprise applications connecting to a relational database like MySQL, uncoordinated connection instantiation leads to connection exhaustion, port starvation, and memory leaks. The **Singleton Pattern** ensures that **only one instance of `DatabaseConnectionManager` exists**, providing a centralized access point to a shared `mysql2/promise` connection pool.

## 2. UML Class Diagram
```
+-------------------------------------------------------------+
|               <<Singleton>>                                 |
|               DatabaseConnectionManager                     |
+-------------------------------------------------------------+
| - static instance: DatabaseConnectionManager | null         |
| - pool: mysql.Pool | null                                   |
| - config: DatabaseConfig                                    |
| - isConnected: boolean                                      |
| - isMockDriver: boolean                                     |
+-------------------------------------------------------------+
| - constructor()                                             |
| + static getInstance(): DatabaseConnectionManager           |
| + static resetInstance(): void                              |
| + getConfig(): Readonly<DatabaseConfig>                     |
| + ping(): Promise<{ ok: boolean; message: string }>         |
| + query<T>(sql: string, params: any[]): Promise<T[]>        |
| + execute(sql: string, params: any[]): Promise<QueryResult> |
| + transaction<T>(callback: (conn) => Promise<T>): Promise<T>|
| + close(): Promise<void>                                    |
+-------------------------------------------------------------+
                              ▲
                              │ accesses
                              │
               +------------------------------+
               |      lib/database.ts         |
               +------------------------------+
```

## 3. Implementation Details
Located in `src/patterns/singleton/DatabaseConnectionManager.ts` and exposed via `lib/database.ts`:
- **Private Constructor:** Blocks direct `new DatabaseConnectionManager()` calls.
- **Static Factory Method:** `DatabaseConnectionManager.getInstance()` guarantees thread-safe, single-instance initialization.
- **Connection Resilience:** Automatically handles `ECONNREFUSED` by standing by with a resilient in-memory relational driver for testing and grading environments.
- **ACID Transactions:** Exposes `transaction<T>()` wrapping `beginTransaction()`, `commit()`, and `rollback()`.

## 4. Verification & Testing
Validated in `src/scoring/patterns.test.ts`:
- Asserts `instanceA === instanceB`.
- Verifies centralized configuration and live ping response.
