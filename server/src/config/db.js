import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const poolConfig = {
  connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/jewelry_db',
  ssl: connectionString && (connectionString.includes('sslmode=require') || connectionString.includes('neon.tech') || isProduction)
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();

export async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Connecting to PostgreSQL...');
    
    // Check if schema file exists
    const schemaPath = path.resolve(__dirname, '../../../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('Database tables verified / initialized successfully.');
    } else {
      console.warn('schema.sql not found at', schemaPath);
    }

    // Check if products table has rows
    const { rows } = await client.query('SELECT COUNT(*)::int as count FROM products');
    if (rows[0].count === 0) {
      console.log('Products table is empty. Running initial database seeding...');
      // Dynamically import seed function
      const { seedDatabase } = await import('../seed.js');
      await seedDatabase();
    } else {
      console.log(`Database connected. Found ${rows[0].count} products in catalog.`);
    }
  } catch (err) {
    console.error('Error during database initialization:', err);
    throw err;
  } finally {
    client.release();
  }
}
