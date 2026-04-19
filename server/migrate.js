import sql from './src/config/db.js';

async function migrate() {
  console.log('Running migrations...');
  try {
    // Add columns to users table
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS car_model VARCHAR(100);`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS car_plate VARCHAR(30);`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 5.00;`;

    // Create reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          ride_id INTEGER REFERENCES rides(id),
          reviewer_id INTEGER REFERENCES users(id),
          reviewee_id INTEGER REFERENCES users(id),
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
