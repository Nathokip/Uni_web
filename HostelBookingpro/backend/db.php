<?php

$host = "127.0.0.1";
$user = "natho";
$pass = "password123";
$db_name = "Unistay_db";

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    die("". $conn->connect_error);
}

?>
