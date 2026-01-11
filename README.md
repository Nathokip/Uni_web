# UniStay - Student Hostel Booking System

UniStay is a comprehensive web-based platform designed to bridge the gap between students and hostel landlords. It facilitates seamless hostel discovery, booking management, and landlord verification.

## 🚀 Features

* **Student Portal**: Browse verified hostels, filter by price/location, and book rooms.
* **Landlord Dashboard**: Manage incoming booking requests (Accept/Reject) and view revenue stats.
* **Admin Panel**: Verify new landlord applications and approve their listings.
* **Secure Authentication**: Login/Registration with Role-Based Access Control (Student vs. Landlord).
* **Real-time Communication**: Integrated WhatsApp Chat and Email Contact forms.
* **Automated Emails**: Password reset functionality via SMTP.

## 🛠️ Tech Stack

* **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
* **Backend**: PHP (Native)
* **Database**: MySQL
* **Server**: Apache (via XAMPP/WAMP)

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have **XAMPP** or **WAMP** installed to run PHP and MySQL.

### 2. Folder Structure
Move the project folder into your server directory (e.g., `C:\xampp\htdocs\`).
**Important:** Ensure your folder is named `Uni_web` or update the fetch paths in the JavaScript files to match your folder name.

### 3. Database Configuration
1.  Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
2.  Create a new database named **`unistay_db`**.
3.  Click on the **SQL** tab and paste the code below to create all required tables.
4.  Update `backend/db.php` if your MySQL password is not empty.

#### 📝 SQL Setup Script
Copy and run this SQL block to set up the entire database:

```sql
-- 1. Users Table (Stores Students, Landlords, and Admins)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'landlord', 'admin') DEFAULT 'student',
    otp_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Landlord Requests (Pending verification applications)
CREATE TABLE landlord_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    id_number VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    hostel_name VARCHAR(100),
    location VARCHAR(255),
    price DECIMAL(10,2),
    id_images JSON,
    ownership_docs JSON,
    hostel_images JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hostels (Approved hostels linked to Landlords)
CREATE TABLE hostels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    landlord_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    price DECIMAL(10, 2),
    description TEXT,
    images JSON, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Bookings (Student reservations)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hostel_id INT NOT NULL,
    hostel_name VARCHAR(100) NOT NULL, -- Stored for history incase hostel name changes
    price DECIMAL(10, 2) NOT NULL,
    move_in_date DATE NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in months',
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. Contact Messages (Inquiries from Contact Us page)
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OPTIONAL: Create a Default Admin User
-- Password is: admin123 (Hashed below)
INSERT INTO users (first_name, last_name, email, password, role) 
VALUES ('System', 'Admin', 'admin@unistay.com', '$2y$10$YourHashedPasswordHere', 'admin');