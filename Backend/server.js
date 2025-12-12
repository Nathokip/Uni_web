require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise version for async/await

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'unistay_user',      // The user we created in Phase 2
    password: 'secure_password', 
    database: 'unistay_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. Test Connection
pool.getConnection()
    .then(conn => {
        console.log("✅ Connected to MariaDB!");
        conn.release();
    })
    .catch(err => console.error("❌ DB Connection Failed:", err));

// 3. API Route: Get Nearby Hostels (MySQL Geospatial Version)
app.get('/api/hostels/nearby', async (req, res) => {
    try {
        const { lat, long, radius } = req.query;
        const searchRadius = radius || 2000; // meters

        // MySQL Specific Query for Distance
        // ST_Distance_Sphere calculates distance in meters on Earth
        const query = `
            SELECT 
                id, name, price, image_url, amenities,
                ST_Y(location) as lat,
                ST_X(location) as long,
                ST_Distance_Sphere(location, POINT(?, ?)) as distance_meters
            FROM hostels
            WHERE ST_Distance_Sphere(location, POINT(?, ?)) <= ?
            ORDER BY distance_meters ASC
        `;

        // Note: MySQL uses (Long, Lat) order for POINT
        const [rows] = await pool.query(query, [long, lat, long, lat, searchRadius]);
        
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));