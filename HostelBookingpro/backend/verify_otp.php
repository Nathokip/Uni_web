<?php
header('Content-Type: application/json');
require __DIR__ . '/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'] ?? '';
    $otp_input = $_POST['otp_code'] ?? '';

    $stmt = $conn->prepare("SELECT id, role FROM users WHERE email = ? AND otp_code = ?");
    $stmt->bind_param("ss", $email, $otp_input);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        $update = $conn->prepare("UPDATE users SET is_verified = 1, otp_code = NULL WHERE id = ?");
        $update->bind_param("i", $user['id']);
        $update->execute();

        $_SESSION['user_id'] = $user['id'];
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid Code']);
    }
}
?>