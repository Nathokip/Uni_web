<?php
// backend/test_db.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "1. Checking MySQLi extension... ";
if (!extension_loaded('mysqli')) {
    die("❌ Error: mysqli extension is NOT loaded. Check php.ini.");
}
echo "✅ Loaded!<br>";

echo "2. Attempting connection... ";
// Default XAMPP/Arch settings
$conn = new mysqli("localhost", "root", "kipnate", "Unistay");

if ($conn->connect_error) {
    die("❌ Connection Failed: " . $conn->connect_error);
}
echo "✅ Connected successfully to database: Unistay";
?>