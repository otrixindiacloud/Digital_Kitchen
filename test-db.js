import 'dotenv/config';
import { db } from './server/db.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('Test query result:', result.rows);
    
    // Let's also check what tables were created
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables created in database:');
    tables.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
