<?php
// backend/manage_bookings.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require __DIR__ . '/db.php';

$action = $_POST['action'] ?? '';

// 1. Fetch All Bookings (For the Dashboard Table)
if ($action === 'fetch') {
    // In a real app, filter by the logged-in landlord's ID: WHERE hostel_owner_id = ?
    $sql = "SELECT b.id, u.first_name, u.last_name, u.phone, b.hostel_name, b.move_in_date, b.total_amount, b.status 
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC";
            
    $result = $conn->query($sql);
    $bookings = [];
    while($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    echo json_encode($bookings);
    exit;
}

// 2. Update Booking Status (Approve/Reject)
if ($action === 'update') {
    $booking_id = $_POST['id'];
    $new_status = $_POST['status']; // 'confirmed' or 'rejected'
    
    $stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $new_status, $booking_id);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Booking updated to ' . $new_status]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update']);
    }
    exit;
}
?>