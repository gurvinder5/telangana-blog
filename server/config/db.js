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

// Immediately test connection to confirm MySQL credentials are valid
pool.getConnection()
  .then(conn => {
    console.log('MySQL Connected Successfully to: ' + (process.env.DB_NAME || 'telangana_tourism_db'));
    conn.release();
  })
  .catch(err => {
    console.error('MySQL Connection Error:', err.message);
    console.warn('Please ensure that your local MySQL server (e.g. XAMPP, WAMP) is active and database settings inside server/.env match.');
  });

module.exports = pool;
