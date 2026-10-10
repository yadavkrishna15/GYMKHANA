-- ============================================================================
-- GYMKHANA DATABASE SCHEMA
-- Smart Gym Management & Fitness Guide
-- Relational MySQL Schema (Compatible with MySQL 5.0 through MySQL 8.x)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS gymkhana_db;
USE gymkhana_db;

-- Drop child tables first for clean re-runs
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS workout_plan_exercises;
DROP TABLE IF EXISTS workout_plans;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS trainers;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS users;

-- 1. Users table (Central authentication & credential repository)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('MEMBER', 'TRAINER', 'ADMIN') NOT NULL DEFAULT 'MEMBER',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 2. Membership Plans table (Access tiers, durations, and rates)
CREATE TABLE memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  duration_months INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  features TEXT NULL,
  access_details TEXT NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 3. Trainers profile table (Linked 1:1 to users with role=TRAINER)
CREATE TABLE trainers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  specialization VARCHAR(150) NOT NULL,
  experience_years INT NOT NULL DEFAULT 1,
  bio TEXT NOT NULL,
  certifications VARCHAR(255) NULL,
  availability_status VARCHAR(50) NOT NULL DEFAULT 'Available',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 4. Members profile table (Linked 1:1 to users with role=MEMBER)
CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  membership_id INT NULL,
  trainer_id INT NULL,
  join_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE SET NULL,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 5. Equipment catalog table (Gym machinery & stations)
CREATE TABLE equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  target_body_part VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  primary_purpose VARCHAR(255) NOT NULL,
  benefits TEXT NULL,
  how_to_use TEXT NOT NULL,
  safety_instructions TEXT NOT NULL,
  image_url VARCHAR(500) NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 6. Exercise library table (Database-driven technique directory)
CREATE TABLE exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  body_part VARCHAR(100) NOT NULL,
  category VARCHAR(100) NULL,
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  equipment_id INT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  benefits TEXT NULL,
  safety_tips TEXT NULL,
  common_mistakes TEXT NULL,
  image_url VARCHAR(500) NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 7. Workout Plans table (Periodized programs)
CREATE TABLE workout_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  goal VARCHAR(100) NOT NULL,
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  duration_weeks INT NOT NULL DEFAULT 4,
  description TEXT NOT NULL,
  created_by INT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (created_by) REFERENCES trainers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 8. Workout Plan Exercises table (Ordered daily exercise prescriptions)
CREATE TABLE workout_plan_exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_id INT NOT NULL,
  exercise_id INT NOT NULL,
  day_or_order VARCHAR(50) NOT NULL DEFAULT 'Day 1',
  sets INT NOT NULL DEFAULT 3,
  reps VARCHAR(50) NOT NULL DEFAULT '10-12',
  rest_seconds INT NOT NULL DEFAULT 60,
  notes VARCHAR(255) NULL,
  FOREIGN KEY (plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 9. Member Attendance table (Physical check-in/out tracking)
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  date DATE NOT NULL,
  check_in_time VARCHAR(20) NOT NULL,
  check_out_time VARCHAR(20) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Present',
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 10. Member Biometric Progress table (Weight, height, BMI tracking)
CREATE TABLE progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  measured_on DATE NOT NULL,
  weight_kg DECIMAL(5, 2) NOT NULL,
  height_cm DECIMAL(5, 2) NULL,
  bmi DECIMAL(4, 1) NULL,
  notes TEXT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 11. Contact & Inquiries table (Public messages and member feedback)
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(30) NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
