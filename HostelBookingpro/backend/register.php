<?php
// backend/register.php

// 1. CORS & Headers (Must be first)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// 2. Pre-flight check
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Error Handling Setup (THE NEW FIX)
// Turn off display_errors so HTML doesn't leak into our JSON
ini_set('display_errors', 1); 
ini_set('log_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

// Register a shutdown function to catch Fatal Errors (like missing files)
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && ($error['type'] === E_ERROR || $error['type'] === E_PARSE || $error['type'] === E_CORE_ERROR)) {
        // Clear any HTML that PHP might have already prepared
        if (ob_get_length()) ob_clean(); 
        
        http_response_code(500);
        echo json_encode([
            'status' => 'error', 
            'message' => 'Critical Server Error: ' . $error['message']
        ]);
        exit();
    }
});

// Start output buffering to capture any accidental echo/print calls
ob_start();

try {
    // 4. Dependencies
    // Ensure database bootstrap exists and load it
    if (!file_exists(__DIR__ . '/db.php')) {
        throw new Exception('db.php file not found');
    }
    require __DIR__ . '/db.php';

    // Ensure Composer autoload exists and load it
    if (!file_exists(__DIR__ . '/../../vendor/autoload.php')) {
        throw new Exception('vendor/autoload.php not found. Did you run composer install?');
    }
    require __DIR__ . '/../../vendor/autoload.php';

    // At this point PHPMailer classes are available via autoload

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        $role = $_POST['role'] ?? 'student';
        $email = $_POST['email'] ?? '';
        $password = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);
        $first_name = $_POST['first_name'] ?? '';
        $last_name = $_POST['last_name'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $university = $_POST['university'] ?? '';
        
        // Generate OTP
        $otp = random_int(10000, 99999);

        // Check if exists
        $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
        if (!$check) throw new Exception("Database Prepare Failed: " . $conn->error);
        
        $check->bind_param("s", $email);
        $check->execute();
        if ($check->get_result()->num_rows > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
            ob_end_flush(); // Send output
            exit;
        }

        // Insert
        $stmt = $conn->prepare("INSERT INTO users (role, first_name, last_name, email, phone, password, university, otp_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) throw new Exception("Database Insert Prepare Failed: " . $conn->error);
        
        $stmt->bind_param("sssssssi", $role, $first_name, $last_name, $email, $phone, $password, $university, $otp);

        if ($stmt->execute()) {
            // Send Email
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'kipyegonnathan467@gmail.com'; 
                $mail->Password = 'twbi nvgf wuje gbhu';    
                $mail->SMTPSecure = 'tls';
                $mail->Port = 587;

                $mail->setFrom('no-reply@unistay.com', 'UniStay');
                $mail->addAddress($email);
                $mail->isHTML(true);
                $mail->Subject = 'Your Verification Code';
                $mail->Body    = "Code: <b>$otp</b>";

                $mail->send();
                echo json_encode(['status' => 'success', 'email' => $email]);
            } catch (MailException $e) {
                // Delete user if email fails
                $conn->query("DELETE FROM users WHERE email = '$email'");
                echo json_encode(['status' => 'error', 'message' => 'Email failed to send: ' . $mail->ErrorInfo]);
            }
        } else {
            throw new Exception('Database insert failed: ' . $stmt->error);
        }
    } else {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed. Received: ' . $_SERVER['REQUEST_METHOD']]);
    }

} catch (Exception $e) {
    // If output buffer is dirty, clean it so we only send JSON
    if (ob_get_length()) ob_clean();
    
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

// Flush the buffer to send the JSON
ob_end_flush();
?>