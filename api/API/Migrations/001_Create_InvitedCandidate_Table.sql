-- Migration script to create InvitedCandidate table
-- This table stores invited candidates by teachers via email

CREATE TABLE IF NOT EXISTS `invitedcandidate` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeacherId` int DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `idx_teacherid` (`TeacherId`),
  KEY `idx_email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
