<?php
// backend/admin_verify.php
header("Content-Type: application/json");
require __DIR__ . '/db.php';

$id = $_POST['id'];
$status = $_POST['status']; // 'approved' or 'rejected'

if ($status === 'approved') {
    // 1. Get the Request Details
    $req = $conn->query("SELECT * FROM landlord_requests WHERE id = $id")->fetch_assoc();
    
    // 2. Create User Account (So they can login)
    // Default password is 'Password123' - In real life, email them a setup link
    $default_pass = password_hash("Password123", PASSWORD_DEFAULT);
    $name_parts = explode(" ", $req['full_name']);
    $first_name = $name_parts[0];
    $last_name = isset($name_parts[1]) ? $name_parts[1] : '';

    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, 'landlord')");
    $stmt->bind_param("sssss", $first_name, $last_name, $req['email'], $req['phone'], $default_pass);
    
    if ($stmt->execute()) {
        // 3. Update Request Status
        $conn->query("UPDATE landlord_requests SET status = 'approved' WHERE id = $id");
        echo json_encode(['status' => 'success', 'message' => 'Approved and account created']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to create user account']);
    }

} else {
    // Just Reject
    $conn->query("UPDATE landlord_requests SET status = 'rejected' WHERE id = $id");
    echo json_encode(['status' => 'success', 'message' => 'Request rejected']);
}
?>