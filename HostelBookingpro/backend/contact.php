<?php
// backend/contact.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require __DIR__ . '/db.php';
require __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Get Data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    // 2. Validate
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }

    // 3. Save to Database
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $subject, $message);

    if ($stmt->execute()) {
        // 4. Send Email Notification to Admin (YOU)
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'kipyegonnathan467@gmail.com'; // Your Email
            $mail->Password = 'twbi nvgf wuje gbhu';    // Your App Password
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            // Email Settings
            $mail->setFrom('no-reply@unistay.com', 'UniStay Contact Form');
            $mail->addAddress('kipyegonnathan467@gmail.com'); // Where you want to receive the message
            $mail->addReplyTo($email, $name); // Allows you to hit "Reply" and email the user back directly

            $mail->isHTML(true);
            $mail->Subject = "New Inquiry: $subject";
            $mail->Body    = "
                <h3>New Contact Message</h3>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Subject:</strong> $subject</p>
                <p><strong>Message:</strong><br>$message</p>
            ";

            $mail->send();
            echo json_encode(['status' => 'success', 'message' => 'Message sent successfully!']);
        } catch (Exception $e) {
            // Even if email fails, we saved it to DB, so we can still say success (or log the error)
            echo json_encode(['status' => 'success', 'message' => 'Message saved (Email notification failed)']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error']);
    }
}
?>