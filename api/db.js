const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Auto-create table on first call
let initialized = false;
async function getPool() {
  if (!initialized) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todo (
        todo_id SERIAL PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `);
    initialized = true;
  }
  return pool;
}

module.exports = { getPool };
