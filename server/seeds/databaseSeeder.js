const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedDatabase() {
  console.log("===================================================");
  console.log("  Running Dynamic Database Seeder & Schema Upgrade ");
  console.log("===================================================");

  // Setup connection to the database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'telangana_tourism_db'
  });

  try {
    console.log("Connected to MySQL Database successfully.");

    // Upgrade schema by adding missing columns to the blogs table safely
    console.log("Checking and upgrading 'blogs' table schema with premium SEO & dynamic fields...");
    
    const [columns] = await connection.query("SHOW COLUMNS FROM blogs");
    const existingColumns = columns.map(c => c.Field.toLowerCase());

    const columnsToAdd = [
      { name: "slug", type: "VARCHAR(255) DEFAULT NULL" },
      { name: "excerpt", type: "TEXT DEFAULT NULL" },
      { name: "content", type: "LONGTEXT DEFAULT NULL" },
      { name: "district", type: "VARCHAR(100) DEFAULT NULL" },
      { name: "best_time_to_visit", type: "VARCHAR(255) DEFAULT NULL" },
      { name: "history", type: "TEXT DEFAULT NULL" },
      { name: "attractions", type: "JSON DEFAULT NULL" },
      { name: "things_to_do", type: "JSON DEFAULT NULL" },
      { name: "how_to_reach", type: "TEXT DEFAULT NULL" },
      { name: "nearby_places", type: "JSON DEFAULT NULL" },
      { name: "food_recommendations", type: "TEXT DEFAULT NULL" },
      { name: "travel_tips", type: "TEXT DEFAULT NULL" },
      { name: "faqs", type: "JSON DEFAULT NULL" },
      { name: "meta_title", type: "VARCHAR(255) DEFAULT NULL" },
      { name: "meta_description", type: "TEXT DEFAULT NULL" },
      { name: "keywords", type: "JSON DEFAULT NULL" },
      { name: "tags", type: "JSON DEFAULT NULL" },
      { name: "published_date", type: "VARCHAR(50) DEFAULT NULL" }
    ];

    for (const col of columnsToAdd) {
      if (!existingColumns.includes(col.name.toLowerCase())) {
        console.log(`Adding missing column: ${col.name}...`);
        await connection.query(`ALTER TABLE blogs ADD COLUMN ${col.name} ${col.type}`);
      }
    }
    console.log("blogs table schema verification and update completed successfully!");

    // Read all JSON files from the seeds/blogs directory
    const blogsDir = path.join(__dirname, 'blogs');
    if (!fs.existsSync(blogsDir)) {
      console.error("Error: server/seeds/blogs/ directory does not exist. Run generation scripts first.");
      return;
    }

    const files = fs.readdirSync(blogsDir).filter(file => file.endsWith('.json'));
    console.log(`Found ${files.length} JSON blog files to seed.`);

    // Clear existing seeded blogs to avoid duplication, keeping clean setup
    console.log("Clearing existing seeded blogs...");
    await connection.query("DELETE FROM blogs WHERE created_by = 1");

    // Insert each blog into the database
    let seededCount = 0;
    for (const file of files) {
      const filePath = path.join(blogsDir, file);
      const blogData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      const query = `
        INSERT INTO blogs (
          title, description, image_url, location, category, created_by,
          slug, excerpt, content, district, best_time_to_visit, history,
          attractions, things_to_do, how_to_reach, nearby_places,
          food_recommendations, travel_tips, faqs, meta_title,
          meta_description, keywords, tags, published_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        blogData.title,
        blogData.excerpt, // Syncing basic description to excerpt
        blogData.featuredImage,
        blogData.location,
        blogData.category,
        1, // Seeded by Admin (created_by: 1)
        blogData.slug,
        blogData.excerpt,
        blogData.content,
        blogData.district,
        blogData.bestTimeToVisit,
        blogData.history,
        JSON.stringify(blogData.attractions),
        JSON.stringify(blogData.thingsToDo),
        blogData.howToReach,
        JSON.stringify(blogData.nearbyPlaces),
        blogData.foodRecommendations,
        blogData.travelTips,
        JSON.stringify(blogData.faqs),
        blogData.metaTitle,
        blogData.metaDescription,
        JSON.stringify(blogData.keywords),
        JSON.stringify(blogData.tags),
        blogData.publishedDate
      ];

      await connection.query(query, values);
      seededCount++;
      console.log(`[Seeded] -> ${blogData.location} (${file})`);
    }

    console.log("===================================================");
    console.log(`  Success! Seeded ${seededCount} tourist blogs.     `);
    console.log("===================================================");

  } catch (error) {
    console.error("Database seeding failed:", error);
  } finally {
    await connection.end();
  }
}

seedDatabase();
