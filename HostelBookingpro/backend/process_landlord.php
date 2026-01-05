<?php
// backend/process_landlord.php
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- 1. COLLECT PERSONAL INFO ---
    $full_name = $_POST['full_name'];
    $id_number = $_POST['id_number'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];

    // --- 2. UPLOAD DOCUMENTS (Helper Function) ---
    function uploadDoc($fileInputName) {
        $targetDir = "uploads/";
        // Check if file exists and has no error
        if (isset($_FILES[$fileInputName])) {
            $fileData = $_FILES[$fileInputName];
            
            // Handle both array inputs (name="field[]") and single inputs (name="field")
            $error = is_array($fileData['error']) ? $fileData['error'][0] : $fileData['error'];
            $name = is_array($fileData['name']) ? $fileData['name'][0] : $fileData['name'];
            $tmp_name = is_array($fileData['tmp_name']) ? $fileData['tmp_name'][0] : $fileData['tmp_name'];

            if ($error == 0) {
                // Use time() to make filename unique
                $fileName = time() . "_doc_" . basename($name); 
                $targetFilePath = $targetDir . $fileName;
                
                // Move file to folder
                if (move_uploaded_file($tmp_name, $targetFilePath)) {
                    return $targetFilePath;
                }
            }
        }
        return null; 
    }

    $path_id = uploadDoc('national_id');
    $path_address = uploadDoc('proof_address');
    $path_ownership = uploadDoc('proof_ownership');
    $path_permit = isset($_FILES['work_permit']) ? uploadDoc('work_permit') : null;

    // --- 3. INSERT LANDLORD ---
    $stmt = $conn->prepare("INSERT INTO landlords (full_name, id_number, phone, email, doc_national_id, doc_proof_address, doc_proof_ownership, doc_work_permit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $full_name, $id_number, $phone, $email, $path_id, $path_address, $path_ownership, $path_permit);
    
    if ($stmt->execute()) {
        $landlord_id = $conn->insert_id; // Get the new ID
        $stmt->close();

        // --- 4. INSERT HOSTEL ---
        $hostel_name = $_POST['hostel_name'];
        $location = $_POST['hostel_location'];
        $price = $_POST['hostel_price'];
        $roommate = $_POST['roommate_option'];
        $desc = $_POST['hostel_description'];
        $amenities = isset($_POST['amenities']) ? json_encode($_POST['amenities']) : json_encode([]);

        $stmt_hostel = $conn->prepare("INSERT INTO hostels (landlord_id, hostel_name, location, price, roommate_option, description, amenities) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt_hostel->bind_param("issdsss", $landlord_id, $hostel_name, $location, $price, $roommate, $desc, $amenities);
        
        if ($stmt_hostel->execute()) {
            $hostel_id = $conn->insert_id; // Get the new Hostel ID
            $stmt_hostel->close();

            // --- 5. INSERT HOSTEL IMAGES (Loop) ---
            if (isset($_FILES['hostel_images'])) {
                $count = count($_FILES['hostel_images']['name']);
                $stmt_img = $conn->prepare("INSERT INTO hostel_images (hostel_id, image_path) VALUES (?, ?)");

                for ($i = 0; $i < $count; $i++) {
                    if ($_FILES['hostel_images']['error'][$i] == 0) {
                        $imgName = time() . "_" . $i . "_" . basename($_FILES['hostel_images']['name'][$i]);
                        $imgPath = "uploads/" . $imgName;
                        
                        if (move_uploaded_file($_FILES['hostel_images']['tmp_name'][$i], $imgPath)) {
                            $stmt_img->bind_param("is", $hostel_id, $imgPath);
                            $stmt_img->execute();
                        }
                    }
                }
                $stmt_img->close();
            }

            echo "<script>alert('Application Submitted! We will verify your documents shortly.'); window.location.href='../index.html';</script>";
        } else {
            echo "Error saving hostel: " . $conn->error;
        }
    } else {
        echo "Error saving landlord: " . $conn->error;
    }
    $conn->close();
}
?>.