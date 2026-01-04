const pool = require('./database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Check if tables exist
    const checkTablesQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'drivers'
      );
    `;

    const result = await pool.query(checkTablesQuery);
    const tablesExist = result.rows[0].exists;

    if (!tablesExist) {
      console.log('📊 Creating database tables...');

      // Read and execute schema file
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');

      await pool.query(schema);
      console.log('✅ Database tables created successfully');
    } else {
      console.log('✅ Database tables already exist');
    }

    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

module.exports = initializeDatabase;
