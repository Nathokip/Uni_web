<?php
// backend/book_hostel.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

session_start();
require __DIR__ . '/db.php';

// 1. Check Login Status
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Please login to book a hostel']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    
    // 2. Get Data from JS
    $hostel_id = $_POST['hostel_id'] ?? 0;
    $hostel_name = $_POST['hostel_name'] ?? '';
    $price = $_POST['price'] ?? 0;
    $move_in_date = $_POST['move_in_date'] ?? '';
    $duration = $_POST['duration'] ?? 1;

    // Calculate Total
    $total_amount = $price * $duration;

    // 3. Validation
    if (empty($hostel_name) || empty($move_in_date)) {
        echo json_encode(['status' => 'error', 'message' => 'Missing booking details']);
        exit;
    }

    // 4. Insert Booking
    $stmt = $conn->prepare("INSERT INTO bookings (user_id, hostel_id, hostel_name, price, move_in_date, duration, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iisdsid", $user_id, $hostel_id, $hostel_name, $price, $move_in_date, $duration, $total_amount);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Booking request submitted successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
    }
}
?>