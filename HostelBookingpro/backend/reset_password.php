<?php
// backend/reset_password.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $otp = $_POST['otp_code'] ?? '';
    $new_pass = $_POST['new_password'] ?? '';

    if (empty($email) || empty($otp) || empty($new_pass)) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    // Hash the new password
    $hashed_password = password_hash($new_pass, PASSWORD_DEFAULT);

    // Update Password AND Clear OTP (Security: One-time use)
    // We strictly check that the email AND the otp match before updating
    $stmt = $conn->prepare("UPDATE users SET password = ?, otp_code = NULL WHERE email = ? AND otp_code = ?");
    $stmt->bind_param("ssi", $hashed_password, $email, $otp);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Password updated successfully']);
        } else {
            // If no rows were affected, it means the Email or OTP was wrong (or expired)
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired reset code']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error']);
    }
}
?>