<?php
// backend/test_db.php

// Enable error reporting to see problems immediately
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>Database Connection Test</h2>";

// 1. Check if the file actually exists
if (!file_exists(__DIR__ . '/db.php')) {
    die("<p style='color:red'>❌ Error: db.php file not found in this folder!</p>");
}

echo "<p>✅ db.php file found.</p>";

// 2. Try to include it
require __DIR__ . '/db.php';

// 3. Test the variable from db.php
if (isset($conn) && $conn instanceof mysqli) {
    if ($conn->connect_error) {
        echo "<p style='color:red'>❌ Connection Variable Exists, but has error: " . $conn->connect_error . "</p>";
    } else {
        echo "<p style='color:green; font-weight:bold;'>✅ SUCCESS! Connected to database successfully.</p>";
        echo "<p>Host Info: " . $conn->host_info . "</p>";
    }
} else {
    echo "<p style='color:red'>❌ Error: \$conn variable is missing or invalid. Check db.php content.</p>";
}
?>