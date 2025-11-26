-- Database Migration Script for Teacher Management Features
-- Run this script to create the necessary tables for teacher management

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TeacherId INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME,
    Price DECIMAL(10, 2),
    Status VARCHAR(50) NOT NULL DEFAULT 'Active',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    IsDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (TeacherId) REFERENCES teacher(Id) ON DELETE CASCADE,
    INDEX idx_teacher (TeacherId),
    INDEX idx_status (Status),
    INDEX idx_is_deleted (IsDeleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CourseId INT NOT NULL,
    CandidateId INT NOT NULL,
    EnrolledDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CompletedDate DATETIME,
    Status VARCHAR(50) NOT NULL DEFAULT 'Active',
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CourseId) REFERENCES courses(Id) ON DELETE CASCADE,
    FOREIGN KEY (CandidateId) REFERENCES candidates(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (CourseId, CandidateId),
    INDEX idx_course (CourseId),
    INDEX idx_candidate (CandidateId),
    INDEX idx_status (Status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    EnrollmentId INT NOT NULL,
    CandidateId INT NOT NULL,
    CourseId INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    PaidDate DATETIME,
    DueDate DATETIME NOT NULL,
    PaymentMethod VARCHAR(100),
    TransactionId VARCHAR(255),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (EnrollmentId) REFERENCES enrollments(Id) ON DELETE CASCADE,
    FOREIGN KEY (CandidateId) REFERENCES candidates(Id) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES courses(Id) ON DELETE CASCADE,
    INDEX idx_enrollment (EnrollmentId),
    INDEX idx_candidate (CandidateId),
    INDEX idx_course (CourseId),
    INDEX idx_status (Status),
    INDEX idx_due_date (DueDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CourseId INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (CourseId) REFERENCES courses(Id) ON DELETE CASCADE,
    INDEX idx_course (CourseId),
    INDEX idx_order (OrderIndex)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create student_progress table
CREATE TABLE IF NOT EXISTS student_progress (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    EnrollmentId INT NOT NULL,
    CandidateId INT NOT NULL,
    TopicId INT NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'Not Started',
    Score DECIMAL(5, 2),
    CompletedDate DATETIME,
    Notes TEXT,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (EnrollmentId) REFERENCES enrollments(Id) ON DELETE CASCADE,
    FOREIGN KEY (CandidateId) REFERENCES candidates(Id) ON DELETE CASCADE,
    FOREIGN KEY (TopicId) REFERENCES topics(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_progress (EnrollmentId, TopicId),
    INDEX idx_enrollment (EnrollmentId),
    INDEX idx_candidate (CandidateId),
    INDEX idx_topic (TopicId),
    INDEX idx_status (Status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create course_invites table
CREATE TABLE IF NOT EXISTS course_invites (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CourseId INT NOT NULL,
    TeacherId INT NOT NULL,
    CandidateEmail VARCHAR(255) NOT NULL,
    CandidateId INT,
    Status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    InviteToken VARCHAR(255),
    ExpiryDate DATETIME,
    SentDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    AcceptedDate DATETIME,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CourseId) REFERENCES courses(Id) ON DELETE CASCADE,
    FOREIGN KEY (TeacherId) REFERENCES teacher(Id) ON DELETE CASCADE,
    FOREIGN KEY (CandidateId) REFERENCES candidates(Id) ON DELETE SET NULL,
    INDEX idx_course (CourseId),
    INDEX idx_teacher (TeacherId),
    INDEX idx_candidate_email (CandidateEmail),
    INDEX idx_status (Status),
    INDEX idx_token (InviteToken)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
