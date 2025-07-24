import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { DatabaseSchema } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDirectory = process.env.DATA_DIRECTORY || path.join(__dirname, '../../data');
const dbPath = path.join(dataDirectory, 'database.sqlite');

console.log('Database path:', dbPath);
console.log('Data directory:', dataDirectory);

// Ensure data directory exists
try {
  if (!fs.existsSync(dataDirectory)) {
    console.log('Creating data directory:', dataDirectory);
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
} catch (error) {
  console.error('Error creating data directory:', error);
}

// Initialize SQLite database
let sqliteDb;
try {
  sqliteDb = new Database(dbPath);
  console.log('Database connection established successfully');
  
  // Enable WAL mode for better concurrency
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('synchronous = NORMAL');
  sqliteDb.pragma('cache_size = 1000');
  sqliteDb.pragma('temp_store = memory');
  
  console.log('Database pragmas configured');
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

export const db = new Kysely<DatabaseSchema>({
  dialect: new SqliteDialect({
    database: sqliteDb,
  }),
  log: (event) => {
    if (event.level === 'query') {
      console.log('SQL Query:', event.query.sql);
    }
    if (event.level === 'error') {
      console.error('SQL Error:', event.error);
    }
  }
});

// Test database connection
try {
  const result = sqliteDb.prepare('SELECT 1 as test').get();
  console.log('Database connection test successful:', result);
} catch (error) {
  console.error('Database connection test failed:', error);
  process.exit(1);
}
