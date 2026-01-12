<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

session_start();

// Ensure db.php exists
if (!file_exists(__DIR__ . '/db.php')) {
    echo json_encode(['status' => 'error', 'message' => 'Database configuration missing']);
    exit;
}
require __DIR__ . '/db.php';

// 1. Check Login Status
// Note: This relies on the user already being logged in via PHP Session
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Please login to book a hostel']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    
    // 2. Get Data & Cast Types (Safety Fix)
    $hostel_id = isset($_POST['hostel_id']) ? (int)$_POST['hostel_id'] : 0;
    $hostel_name = $_POST['hostel_name'] ?? '';
    $price = isset($_POST['price']) ? (float)$_POST['price'] : 0.00;
    $move_in_date = $_POST['move_in_date'] ?? '';
    $duration = isset($_POST['duration']) ? (int)$_POST['duration'] : 1;

    // Calculate Total
    $total_amount = $price * $duration;

    // 3. Validation
    if (empty($hostel_name) || empty($move_in_date) || $hostel_id === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Missing booking details']);
        exit;
    }

    // 4. Insert Booking
    // Types: i (int), i (int), s (string), d (double), s (string), i (int), d (double)
    $stmt = $conn->prepare("INSERT INTO bookings (user_id, hostel_id, hostel_name, price, move_in_date, duration, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    if ($stmt) {
        $stmt->bind_param("iisdsid", $user_id, $hostel_id, $hostel_name, $price, $move_in_date, $duration, $total_amount);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Booking request submitted successfully!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->error]);
    }
}
?>