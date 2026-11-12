-- ============================================================================
-- PATHPROOF CAREER INTELLIGENCE PLATFORM — MYSQL RELATIONAL SCHEMA
-- Software Construction & Development (SCD) University Specification
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `pathproof_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `pathproof_db`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `role` ENUM('STUDENT', 'ADMIN', 'REVIEWER') NOT NULL DEFAULT 'STUDENT',
  `account_status` ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS `student_profiles` (
  `profile_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `university_name` VARCHAR(200) DEFAULT 'NUST Islamabad',
  `degree_program` VARCHAR(150) DEFAULT 'BS Software Engineering',
  `current_semester` TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `graduation_year` SMALLINT UNSIGNED DEFAULT 2026,
  `weekly_learning_hours` DECIMAL(4,1) NOT NULL DEFAULT 15.0,
  `budget_preference` ENUM('FREE_ONLY', 'LOW_COST', 'ANY', 'NOT_SPECIFIED') DEFAULT 'NOT_SPECIFIED',
  `learning_preference` ENUM('HANDS_ON', 'THEORETICAL', 'HYBRID', 'PROJECT_BASED', 'NOT_SPECIFIED') DEFAULT 'NOT_SPECIFIED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  INDEX `idx_profile_semester` (`current_semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CAREER PATHS TABLE
CREATE TABLE IF NOT EXISTS `career_paths` (
  `career_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL,
  `career_title` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `summary` TEXT NOT NULL,
  `description` TEXT,
  `salary_range_pkr` VARCHAR(100) DEFAULT 'PKR 80,000 – 140,000',
  `publication_status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'PUBLISHED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_career_slug` (`slug`),
  INDEX `idx_career_status` (`publication_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. COMPETENCIES TABLE
CREATE TABLE IF NOT EXISTS `competencies` (
  `competency_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_competency_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CAREER COMPETENCIES (JUNCTION TABLE)
CREATE TABLE IF NOT EXISTS `career_competencies` (
  `career_id` INT NOT NULL,
  `competency_id` INT NOT NULL,
  `target_level` TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '1: Beginner, 2: Basic, 3: Intermediate, 4: Advanced',
  `importance_weight` DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  `requirement_type` ENUM('CORE', 'ELECTIVE') NOT NULL DEFAULT 'CORE',
  PRIMARY KEY (`career_id`, `competency_id`),
  CONSTRAINT `fk_cc_career` FOREIGN KEY (`career_id`) REFERENCES `career_paths` (`career_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cc_competency` FOREIGN KEY (`competency_id`) REFERENCES `competencies` (`competency_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SKILL ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS `skill_assessments` (
  `assessment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `competency_id` INT NOT NULL,
  `proficiency_level` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `notes` TEXT,
  `verified_status` ENUM('UNVERIFIED', 'SELF_REPORTED', 'PEER_REVIEWED', 'FACULTY_VERIFIED') DEFAULT 'SELF_REPORTED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_competency` (`user_id`, `competency_id`),
  CONSTRAINT `fk_sa_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sa_competency` FOREIGN KEY (`competency_id`) REFERENCES `competencies` (`competency_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. EVIDENCE ITEMS TABLE
CREATE TABLE IF NOT EXISTS `evidence_items` (
  `evidence_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `evidence_type` ENUM('PROJECT', 'GITHUB', 'COURSEWORK', 'CERTIFICATION', 'RESEARCH') NOT NULL,
  `external_url` VARCHAR(500),
  `verification_status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_WORK') NOT NULL DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_evidence_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  INDEX `idx_evidence_user_status` (`user_id`, `verification_status`),
  INDEX `idx_evidence_type` (`evidence_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. EVIDENCE SKILLS TABLE (JUNCTION)
CREATE TABLE IF NOT EXISTS `evidence_skills` (
  `evidence_id` INT NOT NULL,
  `competency_id` INT NOT NULL,
  `claimed_level` TINYINT UNSIGNED NOT NULL DEFAULT 2,
  PRIMARY KEY (`evidence_id`, `competency_id`),
  CONSTRAINT `fk_es_evidence` FOREIGN KEY (`evidence_id`) REFERENCES `evidence_items` (`evidence_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_es_competency` FOREIGN KEY (`competency_id`) REFERENCES `competencies` (`competency_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. REVIEWERS TABLE
CREATE TABLE IF NOT EXISTS `reviewers` (
  `reviewer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `department` VARCHAR(150) NOT NULL DEFAULT 'Department of Computing',
  `title` VARCHAR(100) NOT NULL DEFAULT 'Associate Professor',
  `can_verify_academics` BOOLEAN NOT NULL DEFAULT TRUE,
  `can_verify_industry` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_reviewer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. EVIDENCE VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `evidence_verifications` (
  `verification_id` INT AUTO_INCREMENT PRIMARY KEY,
  `evidence_id` INT NOT NULL,
  `reviewer_id` INT NOT NULL,
  `previous_status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_WORK') NOT NULL,
  `new_status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_WORK') NOT NULL,
  `feedback` TEXT NOT NULL,
  `reviewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ev_evidence` FOREIGN KEY (`evidence_id`) REFERENCES `evidence_items` (`evidence_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ev_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `reviewers` (`reviewer_id`) ON DELETE CASCADE,
  INDEX `idx_ev_evidence_reviewer` (`evidence_id`, `reviewer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. ROADMAP ITEMS TABLE
CREATE TABLE IF NOT EXISTS `roadmap_items` (
  `item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `career_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `target_week` TINYINT UNSIGNED NOT NULL,
  `estimated_hours` DECIMAL(4,1) NOT NULL DEFAULT 8.0,
  `deliverable` VARCHAR(255),
  `is_completed` BOOLEAN NOT NULL DEFAULT FALSE,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_roadmap_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_roadmap_career` FOREIGN KEY (`career_id`) REFERENCES `career_paths` (`career_id`) ON DELETE CASCADE,
  INDEX `idx_roadmap_user_career` (`user_id`, `career_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
  `notification_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `notification_type` VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `reference_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  INDEX `idx_notif_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. ACTIVITY HISTORY TABLE
CREATE TABLE IF NOT EXISTS `activity_history` (
  `activity_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `action_type` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` INT DEFAULT NULL,
  `description` TEXT NOT NULL,
  `metadata_json` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  INDEX `idx_activity_user` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. COPILOT CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS `copilot_conversations` (
  `conversation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  INDEX `idx_conv_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. COPILOT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS `copilot_messages` (
  `message_id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `sender` ENUM('user', 'assistant', 'system') NOT NULL,
  `content` TEXT NOT NULL,
  `action_type` VARCHAR(100) DEFAULT NULL,
  `action_payload_json` JSON DEFAULT NULL,
  `is_fallback` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cm_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `copilot_conversations` (`conversation_id`) ON DELETE CASCADE,
  INDEX `idx_cm_conversation` (`conversation_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
