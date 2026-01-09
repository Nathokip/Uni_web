<?php
// backend/forgot_password.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require __DIR__ . '/db.php';
require __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';

    // 1. Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        // Security: Don't reveal if email exists or not, but for now we will for debugging
        echo json_encode(['status' => 'error', 'message' => 'Email not found in our records']);
        exit;
    }

    // 2. Generate Code
    $otp = random_int(10000, 99999);

    // 3. Save Code to DB
    $update = $conn->prepare("UPDATE users SET otp_code = ? WHERE email = ?");
    $update->bind_param("is", $otp, $email);
    
    if ($update->execute()) {
        // 4. Send Email
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'kipyegonnathan467@gmail.com'; 
            $mail->Password = 'twbi nvgf wuje gbhu'; // Your App Password
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom('no-reply@unistay.com', 'UniStay Security');
            $mail->addAddress($email);
            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Code';
            $mail->Body    = "Your password reset code is: <h2 style='color:#2563eb'>$otp</h2>";

            $mail->send();
            echo json_encode(['status' => 'success']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database update failed']);
    }
}
?>