<?php
// backend/admin_get_requests.php
header("Content-Type: application/json");
require __DIR__ . '/db.php';

// Security: In a real app, check if $_SESSION['role'] === 'admin' here!

$sql = "SELECT * FROM landlord_requests WHERE status = 'pending' ORDER BY created_at DESC";
$result = $conn->query($sql);

$requests = [];
while($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode($requests);
?>