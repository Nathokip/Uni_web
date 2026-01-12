<?php
// backend/get_hostels.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require __DIR__ . '/db.php';

// Fetch only approved hostels
$sql = "SELECT id, hostel_name as name, location, price, hostel_images as image, '4.5' as rating 
        FROM landlord_requests 
        WHERE status = 'approved'";

$result = $conn->query($sql);

$hostels = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Fix Image Path: database has JSON string like "[\"path/to/img\"]"
        // We need to decode it to get the actual URL
        $images = json_decode($row['image']); 
        // If it's an array, take the first one, or use a placeholder
        $mainImage = !empty($images) ? $images[0] : 'assets/images/placeholder.jpg';
        
        // Add to array matching your JS structure
        $hostels[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'location' => $row['location'],
            'price' => (int)$row['price'],
            'originalPrice' => (int)$row['price'] + 2000, // Fake original price for UI logic
            'discount' => 10, // Fake discount
            'roommateOption' => 'share', // Default value
            'rating' => 4.5,
            'reviews' => 10,
            'images' => !empty($images) ? $images : ['assets/images/placeholder.jpg'],
            'amenities' => ["WiFi", "Security"], // Default amenities
            'verified' => true
        ];
    }
}

echo json_encode($hostels);
?>