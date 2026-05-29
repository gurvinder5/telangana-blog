-- CREATE DATABASE AND SCHEMAS
CREATE DATABASE IF NOT EXISTS telangana_tourism_db;
USE telangana_tourism_db;

-- DROP TABLES IF THEY EXIST FOR CLEAN SETUP
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;

-- CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CREATE BLOGS TABLE
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    location VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEED DATA
-- Seed Users (Bcrypt hash of 'password123' is '$2a$10$R9h/lIPzNgb.aQH9uywLH.z.gK13m1a6Z79/qW8m9qQ7g9t.T.x5q')
INSERT INTO users (id, name, email, password) VALUES
(1, 'Admin Explorer', 'admin@telanganatourism.com', '$2a$10$R9h/lIPzNgb.aQH9uywLH.z.gK13m1a6Z79/qW8m9qQ7g9t.T.x5q'),
(2, 'Rajesh Kumar', 'rajesh@example.com', '$2a$10$R9h/lIPzNgb.aQH9uywLH.z.gK13m1a6Z79/qW8m9qQ7g9t.T.x5q')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Blogs
INSERT INTO blogs (id, title, description, image_url, location, category, created_by) VALUES
(1, 'A Majestic Journey to Golconda Fort', 'Golconda Fort is one of the most magnificent fortress complexes in India. Originally built by the Kakatiya dynasty in the 13th century, it was later fortified and expanded by the Qutb Shahi kings who made it their capital. The acoustic system is one of the architectural marvels here—a handclap at the main gate can be heard clearly at the Bala Hissar pavilion, the highest point of the fort. Visiting during sunset provides a breathtaking panoramic view of the Hyderabad skyline, and the evening sound-and-light show brings its rich history to life.', 'https://images.unsplash.com/photo-1600100397608-f010e42ed97c?auto=format&fit=crop&w=1200&q=80', 'Golconda Fort', 'Historical Places', 1),

(2, 'Exploring the Serenity of Ramappa Temple', 'Ramappa Temple, also known as the Ramalingeswara Temple, is a UNESCO World Heritage site located in Palampet. Built in 1213 AD during the reign of the Kakatiya Empire, this temple is a masterpiece of architectural brilliance. What makes it unique is that it is named after its chief sculptor, Ramappa, rather than the presiding deity. The temple is constructed using sandbox technology, and its bricks are so light that they float on water. The intricate carvings on the black basalt pillars tell stories of ancient dance forms and mythological legends, making it a must-visit for art and history lovers.', 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80', 'Ramappa Temple', 'Temples', 1),

(3, 'The Iconic Heart of Hyderabad: Charminar', 'No trip to Telangana is complete without visiting the iconic Charminar. Built in 1591 by Sultan Muhammad Quli Qutb Shah to celebrate the end of a deadly plague, this grand monument features four ornate minarets that tower over the bustling streets of old Hyderabad. Surrounding Charminar are vibrant bazaars, including the famous Laad Bazaar, known for its exquisite bangles, and numerous food stalls serving authentic Hyderabadi Biryani and Irani Chai. Clambering up the steep winding steps of the minarets offers a stunning view of the Mecca Masjid and the colorful chaos below.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', 'Charminar', 'Hyderabad Attractions', 2),

(4, 'Bhongir Fort: A Trekker''s Paradise', 'Bhongir Fort, perched atop a massive, single monolithic rock, is an exhilarating destination for adventure enthusiasts and history buffs alike. Located in Yadadri Bhuvanagiri district, the fort was built by the Western Chalukya ruler Tribhuvanamalla Vikramaditya VI in the 10th century. The climb to the top is steep and thrilling, offering panoramic views of the surrounding countryside. The fort features secret underground chambers, an armory, and large water reservoirs carved directly into the rock. It stands as an impressive engineering feat of medieval military architecture.', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Bhongir Fort', 'Historical Places', 2),

(5, 'Marveling at Nagarjuna Sagar Dam', 'Nagarjuna Sagar Dam is one of the world''s largest and tallest masonry dams, built across the mighty Krishna River. Straddling the border of Telangana and Andhra Pradesh, it is a magnificent sight, especially during the monsoon season when the crest gates are opened, creating a roaring wall of water. From the dam, you can take a scenic ferry ride to Nagarjunakonda, an island museum housing priceless Buddhist relics and ruins dating back to the 3rd century AD. The beautiful valley surroundings and calm waters make it an ideal weekend getaway.', 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80', 'Nagarjuna Sagar', 'Waterfalls', 1)
ON DUPLICATE KEY UPDATE id=id;

-- CREATE CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

