<?php
// backend/process_landlord.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require __DIR__ . '/db.php';

// 1. Helper function to upload files
function uploadFiles($fileInputName, $targetDir) {
    $uploadedPaths = [];
    if (!file_exists($targetDir)) mkdir($targetDir, 0777, true);

    if (isset($_FILES[$fileInputName])) {
        $files = $_FILES[$fileInputName];
        $count = is_array($files['name']) ? count($files['name']) : 1;

        for ($i = 0; $i < $count; $i++) {
            $fileName = is_array($files['name']) ? $files['name'][$i] : $files['name'];
            $fileTmp = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
            $fileError = is_array($files['error']) ? $files['error'][$i] : $files['error'];

            if ($fileError === 0) {
                $newFileName = uniqid() . '_' . basename($fileName);
                $targetPath = $targetDir . $newFileName;
                if (move_uploaded_file($fileTmp, $targetPath)) {
                    $uploadedPaths[] = $targetPath;
                }
            }
        }
    }
    return json_encode($uploadedPaths); // Store as JSON string in DB
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = $_POST['full_name'] ?? '';
    $idNumber = $_POST['id_number'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    $hostelName = $_POST['hostel_name'] ?? '';
    $price = $_POST['hostel_price'] ?? 0;
    $location = $_POST['hostel_location'] ?? '';

    // 2. Upload Files
    // Make sure you create an 'uploads' folder in your project root!
    $idPath = uploadFiles('national_id', '../uploads/ids/');
    $ownershipPath = uploadFiles('proof_ownership', '../uploads/ownership/');
    $hostelImagesPath = uploadFiles('hostel_images', '../uploads/hostels/');

    // 3. Insert into Database
    // Note: You need a 'landlords' or 'hostels' table. 
    // This is a simplified query assuming you put everything in the 'hostels' table or a requests table.
    
    $stmt = $conn->prepare("INSERT INTO landlord_requests (full_name, id_number, phone, email, hostel_name, location, price, id_images, ownership_docs, hostel_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("ssssssdsss", $fullName, $idNumber, $phone, $email, $hostelName, $location, $price, $idPath, $ownershipPath, $hostelImagesPath);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'name' => $fullName]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
    }
}
?>