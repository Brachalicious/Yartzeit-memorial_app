import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { DatabaseSchema } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Initializing database connection...');

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
  throw error;
}

// Initialize SQLite database
let sqliteDb;
try {
  sqliteDb = new Database(dbPath);
  console.log('✅ SQLite database file connected');
  
  // Enable WAL mode for better concurrency
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('synchronous = NORMAL');
  sqliteDb.pragma('cache_size = 1000');
  sqliteDb.pragma('temp_store = memory');
  sqliteDb.pragma('foreign_keys = ON');
  
  console.log('✅ Database pragmas configured');
  
} catch (error) {
  console.error('❌ Failed to initialize SQLite database:', error);
  throw error;
}

function initializeTables(db) {
  try {
    console.log('🔧 Initializing database tables...');
    
    // Create yahrzeit_entries table
    db.exec(`
      CREATE TABLE IF NOT EXISTS yahrzeit_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        hebrew_name TEXT,
        death_date TEXT NOT NULL,
        hebrew_death_date TEXT NOT NULL,
        relationship TEXT,
        notes TEXT,
        notify_days_before INTEGER DEFAULT 7,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create letters table
    db.exec(`
      CREATE TABLE IF NOT EXISTS letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create learning_activities table
    db.exec(`
      CREATE TABLE IF NOT EXISTS learning_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_type TEXT NOT NULL CHECK (activity_type IN ('tehillim', 'torah')),
        title TEXT NOT NULL,
        description TEXT,
        date_completed TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tehillim_chapters table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tehillim_chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_number INTEGER NOT NULL,
        chapter_name TEXT,
        date_completed TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create shmiras_halashon_entries table
    db.exec(`
      CREATE TABLE IF NOT EXISTS shmiras_halashon_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date_recorded TEXT NOT NULL,
        positive_speech_count INTEGER DEFAULT 0,
        avoided_lashon_hara INTEGER DEFAULT 0,
        gave_compliments INTEGER DEFAULT 0,
        spoke_words_of_torah INTEGER DEFAULT 0,
        helped_through_speech INTEGER DEFAULT 0,
        reflection_notes TEXT,
        daily_goal TEXT,
        challenges_faced TEXT,
        improvements_noticed TEXT,
        overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_yahrzeit_entries_name ON yahrzeit_entries(name);
      CREATE INDEX IF NOT EXISTS idx_yahrzeit_entries_death_date ON yahrzeit_entries(death_date);
      CREATE INDEX IF NOT EXISTS idx_learning_activities_type ON learning_activities(activity_type);
      CREATE INDEX IF NOT EXISTS idx_learning_activities_date ON learning_activities(date_completed);
      CREATE INDEX IF NOT EXISTS idx_tehillim_chapters_date ON tehillim_chapters(date_completed);
      CREATE INDEX IF NOT EXISTS idx_tehillim_chapters_number ON tehillim_chapters(chapter_number);
      CREATE INDEX IF NOT EXISTS idx_shmiras_halashon_date ON shmiras_halashon_entries(date_recorded);
      CREATE INDEX IF NOT EXISTS idx_shmiras_halashon_rating ON shmiras_halashon_entries(overall_rating);
    `);

    console.log('✅ Database tables and indexes created');

    // Insert sample data for Chaya Sara Leah if not exists
    const existingEntry = db.prepare('SELECT id FROM yahrzeit_entries WHERE name = ?').get('Chaya Sara Leah Bas Uri');
    if (!existingEntry) {
      try {
        db.prepare(`
          INSERT INTO yahrzeit_entries (
            name, hebrew_name, death_date, hebrew_death_date, relationship, notes, notify_days_before
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          'Chaya Sara Leah Bas Uri',
          'חיה שרה לאה בת אורי',
          '2024-11-23',
          '22/3/5785',
          'Beloved Mother',
          'A special soul who brought light to everyone she met. May her memory be a blessing.',
          7
        );
        console.log('✅ Added sample yahrzeit entry for Chaya Sara Leah');
      } catch (error) {
        console.log('Note: Could not add sample entry (may already exist)');
      }
    }

    console.log('✅ Database initialization completed successfully');
    
  } catch (error) {
    console.error('❌ Error initializing database tables:', error);
    throw error;
  }
}

// Initialize tables
try {
  initializeTables(sqliteDb);
} catch (error) {
  console.error('❌ Failed to initialize database tables:', error);
  throw error;
}

// Create Kysely instance
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
  console.log('✅ Database connection test successful:', result);
  
  // Test table existence
  const tables = sqliteDb.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all();
  console.log('✅ Available tables:', tables.map(t => t.name));
  
} catch (error) {
  console.error('❌ Database connection test failed:', error);
  throw error;
}

console.log('✅ Database connection module loaded successfully');
