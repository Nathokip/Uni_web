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

#### 📝 SQL Setup Script
Copy and run this SQL block to set up the entire database:

```sql
--- 1. Create and Select Database
CREATE DATABASE IF NOT EXISTS unistay_db;
USE unistay_db;

-- 2. Create Users Table (Stores both Students and Landlords)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('student', 'landlord') NOT NULL DEFAULT 'student',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    university VARCHAR(255) NULL,   -- Nullable: Only for students
    national_id VARCHAR(50) NULL,   -- Nullable: Only for landlords
    otp_code INT NULL,              -- Stores the 5-digit verification code
    is_verified TINYINT(1) DEFAULT 0, -- 0 = Unverified, 1 = Verified
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Landlord Requests Table (For hostel listing applications)
CREATE TABLE landlord_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Landlord Personal Details
    full_name VARCHAR(255) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Hostel Details
    hostel_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    
    -- File Paths (Stored as JSON strings)
    id_images JSON DEFAULT NULL,
    ownership_docs JSON DEFAULT NULL,
    hostel_images JSON DEFAULT NULL,
    
    -- Admin Action
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Bookings Table (Links Students to Hostels)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key linking to the Student
    user_id INT NOT NULL,
    
    -- Hostel Info (Captured at time of booking)
    hostel_id INT NOT NULL,
    hostel_name VARCHAR(255) NOT NULL,
    
    -- Financials
    price DECIMAL(10, 2) NOT NULL,
    
    -- Booking Details
    move_in_date DATE NOT NULL,
    duration INT NOT NULL, -- Number of months
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Booking Status
    status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relationship Constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Create Contact Messages Table (For the contact form)
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);