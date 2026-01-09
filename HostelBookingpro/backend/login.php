<?php
// backend/login.php

// 1. Setup Headers & Error Handling
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', 0); // Hide errors from output
error_reporting(E_ALL);

// Start Session (Important for Login!)
session_start();

try {
    // 2. Connect to Database
    require __DIR__ . '/db.php';
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid Request Method');
    }
    
    // 3. Get Data
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        throw new Exception('Please enter both email and password');
    }
    
    // 4. Find User by Email
    $stmt = $conn->prepare("SELECT id, first_name, last_name, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('User not found');
    }
    
    $user = $result->fetch_assoc();
    
    // 5. Verify Password
    if (password_verify($password, $user['password'])) {
        // SUCCESS: Store user info in Session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['first_name'];
        $_SESSION['role'] = $user['role'];
        
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "role" => $user['role'],
            "user" => [
                "name" => $user['first_name'] . ' ' . $user['last_name'],
                "email" => $email
            ]
        ]);
    } else {
        throw new Exception('Incorrect password');
    }
    
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>