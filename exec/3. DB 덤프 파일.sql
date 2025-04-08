-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: stg-yswa-kr-practice-db-master.mariadb.database.azure.com    Database: s12p22a205
-- ------------------------------------------------------
-- Server version	5.6.47.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `alert_type` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `content` text COLLATE utf8mb4_bin NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_alerts_user_id` (`user_id`),
  KEY `idx_alerts_alert_type` (`alert_type`),
  KEY `idx_alerts_is_read` (`is_read`),
  KEY `idx_alerts_created_at` (`created_at`),
  CONSTRAINT `fk_alerts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chat_reads`
--

DROP TABLE IF EXISTS `chat_reads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_reads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `read_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_chat` (`chat_id`,`user_id`),
  KEY `fk_chat_reads_user` (`user_id`),
  CONSTRAINT `fk_chat_reads_chat` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_reads_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `form_id` int(11) NOT NULL,
  `writer_id` int(11) NOT NULL,
  `content` text COLLATE utf8mb4_bin NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `message_type` varchar(255) COLLATE utf8mb4_bin DEFAULT 'CHAT',
  `target_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_chats_form_id` (`form_id`),
  KEY `idx_chats_writer_id` (`writer_id`),
  KEY `idx_chats_created_at` (`created_at`),
  CONSTRAINT `fk_chats_form` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`),
  CONSTRAINT `fk_chats_writer` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contracts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `form_id` int(11) NOT NULL,
  `overdue_count` int(11) NOT NULL DEFAULT 0,
  `overdue_amount` bigint(20) NOT NULL DEFAULT 0,
  `next_repayment_date` date NOT NULL,
  `early_repayment_count` int(11) NOT NULL DEFAULT 0,
  `total_early_repayment_fee` bigint(20) NOT NULL DEFAULT 0,
  `remaining_principal` bigint(20) NOT NULL,
  `remaining_principal_minus_overdue` bigint(20) NOT NULL,
  `interest_amount` bigint(20) NOT NULL DEFAULT 0,
  `overdue_interest_amount` bigint(20) NOT NULL DEFAULT 0,
  `expected_maturity_payment` bigint(20) NOT NULL,
  `current_payment_round` int(11) NOT NULL DEFAULT 1,
  `expected_interest_amount_at_maturity` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_contracts_form_id` (`form_id`),
  KEY `idx_contracts_next_repayment_date` (`next_repayment_date`),
  CONSTRAINT `fk_contracts_form` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fcm_tokens`
--

DROP TABLE IF EXISTS `fcm_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fcm_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_fcm_tokens_user_id` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `forms`
--

DROP TABLE IF EXISTS `forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` enum('BEFORE_APPROVAL','AFTER_APPROVAL','IN_PROGRESS','OVERDUE','COMPLETED','TERMINATION_REQUESTED','TERMINATION_FIRST_SIGNED') COLLATE utf8mb4_bin NOT NULL,
  `creator_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `creditor_id` int(11) NOT NULL,
  `debtor_id` int(11) NOT NULL,
  `creditor_name` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `creditor_address` text COLLATE utf8mb4_bin NOT NULL,
  `creditor_phone` varchar(20) COLLATE utf8mb4_bin NOT NULL,
  `creditor_bank` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `creditor_account` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `debtor_name` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `debtor_address` text COLLATE utf8mb4_bin NOT NULL,
  `debtor_phone` varchar(20) COLLATE utf8mb4_bin NOT NULL,
  `debtor_bank` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `debtor_account` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `contract_date` datetime(6) NOT NULL,
  `maturity_date` datetime(6) NOT NULL,
  `loan_amount` bigint(20) NOT NULL,
  `repayment_method` enum('EQUAL_PRINCIPAL','EQUAL_PRINCIPAL_INTEREST','PRINCIPAL_ONLY') COLLATE utf8mb4_bin DEFAULT NULL,
  `repayment_day` int(11) NOT NULL,
  `interest_rate` decimal(5,2) DEFAULT 0.00,
  `early_repayment_fee_rate` decimal(5,2) DEFAULT 0.00,
  `overdue_interest_rate` decimal(5,2) DEFAULT 0.00,
  `overdue_limit` int(11) DEFAULT 0,
  `is_termination_process` enum('NONE','REQUESTED','SIGNED') COLLATE utf8mb4_bin NOT NULL DEFAULT 'NONE',
  `termination_requested_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contracts_creator` (`creator_id`),
  KEY `fk_contracts_receiver` (`receiver_id`),
  KEY `idx_forms_status` (`status`),
  KEY `idx_forms_creditor_id` (`creditor_id`),
  KEY `idx_forms_debtor_id` (`debtor_id`),
  KEY `idx_forms_maturity_date` (`maturity_date`),
  KEY `fk_forms_termination_requested_user` (`termination_requested_id`),
  CONSTRAINT `fk_contracts_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_contracts_creditor` FOREIGN KEY (`creditor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_contracts_debtor` FOREIGN KEY (`debtor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_contracts_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_forms_termination_requested_user` FOREIGN KEY (`termination_requested_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_schedule`
--

DROP TABLE IF EXISTS `payment_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contract_id` bigint(20) NOT NULL,
  `payment_round` int(11) NOT NULL,
  `scheduled_payment_date` datetime NOT NULL,
  `scheduled_principal` bigint(20) NOT NULL,
  `scheduled_interest` bigint(20) NOT NULL,
  `overdue_amount` bigint(20) NOT NULL DEFAULT 0,
  `early_repayment_fee` bigint(20) NOT NULL DEFAULT 0,
  `actual_paid_amount` bigint(20) DEFAULT 0,
  `actual_paid_date` datetime DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT 0,
  `is_overdue` tinyint(1) DEFAULT 0,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_payment_schedule_contract_id` (`contract_id`),
  KEY `idx_payment_schedule_payment_round` (`payment_round`),
  KEY `idx_payment_schedule_payment_date` (`scheduled_payment_date`),
  KEY `idx_payment_schedule_is_paid` (`is_paid`),
  KEY `idx_payment_schedule_is_overdue` (`is_overdue`),
  CONSTRAINT `fk_payment_schedule_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `special_terms`
--

DROP TABLE IF EXISTS `special_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `special_terms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `form_id` int(11) NOT NULL,
  `special_term_detail` text COLLATE utf8mb4_bin NOT NULL,
  `special_term_index` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_special_terms_form_id` (`form_id`),
  CONSTRAINT `fk_special_terms_form` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transfers`
--

DROP TABLE IF EXISTS `transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `form_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `amount` bigint(20) NOT NULL,
  `current_round` int(11) NOT NULL,
  `payment_difference` bigint(20) NOT NULL DEFAULT 0,
  `status` enum('OVERDUE','PAID','EARLY_REPAYMENT') COLLATE utf8mb4_bin DEFAULT NULL,
  `transaction_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_transfers_form_id` (`form_id`),
  KEY `idx_transfers_sender_id` (`sender_id`),
  KEY `idx_transfers_receiver_id` (`receiver_id`),
  KEY `idx_transfers_transaction_date` (`transaction_date`),
  KEY `idx_transfers_status` (`status`),
  CONSTRAINT `fk_transfers_form` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`),
  CONSTRAINT `fk_transfers_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_transfers_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `provider` enum('LOCAL','NAVER','GOOGLE') COLLATE utf8mb4_bin NOT NULL DEFAULT 'LOCAL',
  `password` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_bin DEFAULT 'USER',
  `address` varchar(225) COLLATE utf8mb4_bin DEFAULT NULL,
  `address_detail` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `account_number` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `account_password` varchar(12) COLLATE utf8mb4_bin DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
  `is_logged` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `unique_phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-08 16:05:00
