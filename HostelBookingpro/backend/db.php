<?php

$host = "localhost";
$user = "root";
$pass = "kipnate";
$db_name = "Unistay";

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    die("". $conn->connect_error);
}

$method = $_SERVER["REQUEST_METHOD"];

?>
