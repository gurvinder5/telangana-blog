const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'telangana_tourism_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Immediately test connection to confirm MySQL credentials are valid and ensure tables exist
pool.getConnection()
  .then(async conn => {
    console.log('MySQL Connected Successfully to: ' + (process.env.DB_NAME || 'telangana_tourism_db'));
    conn.release();

    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('MySQL contacts table verification/creation completed.');

      await pool.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          blog_id INT NOT NULL,
          name VARCHAR(100) NOT NULL,
          rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
          comment TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('MySQL reviews table verification/creation completed.');
    } catch (tableErr) {
      console.error('Error auto-creating database tables:', tableErr.message);
    }
  })
  .catch(err => {
    console.error('MySQL Connection Error:', err.message);
    console.warn('Please ensure that your local MySQL server (e.g. XAMPP, WAMP) is active and database settings inside server/.env match.');
  });

module.exports = pool;
