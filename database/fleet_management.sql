-- phpMyAdmin SQL Dump
-- version 6.0.0-dev+20251127.a700ba5407
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 29, 2026 at 04:48 PM
-- Server version: 8.4.3
-- PHP Version: 8.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fleet_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `accidents`
--

CREATE TABLE `accidents` (
  `id` bigint UNSIGNED NOT NULL,
  `vehicleId` bigint UNSIGNED NOT NULL,
  `driverId` bigint UNSIGNED NOT NULL,
  `date` datetime NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `claimStatus` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `claimProgress` int NOT NULL DEFAULT '0',
  `estimatedCost` decimal(12,2) DEFAULT NULL,
  `report_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` bigint UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `type`, `message`, `user`, `created_at`, `updated_at`) VALUES
(1, 'booking', 'New booking created for WCD 3456', 'Lim Wei Sheng', '2026-04-27 09:30:25', '2026-04-27 09:30:25'),
(2, 'maintenance', 'Maintenance started on WAB 9012', 'System', '2026-04-27 09:30:25', '2026-04-27 09:30:25'),
(3, 'fine', 'Traffic fine logged against Ahmad Faizal', 'Admin', '2026-04-27 09:30:25', '2026-04-27 09:30:25'),
(4, 'insurance', 'Insurance expiring soon: WXY 5678', 'System', '2026-04-27 09:30:25', '2026-04-27 09:30:25'),
(5, 'disposal', 'Vehicle WGH 1122 successfully disposed', 'Admin', '2026-04-27 09:30:25', '2026-04-27 09:30:25'),
(6, 'vehicle', 'New vehicle added: 5G 4989 (Proton Fortuner)', 'Admin User', '2026-04-28 04:12:02', '2026-04-28 04:12:02'),
(7, 'vehicle', 'New vehicle added: 5G 4989 (Proton Fortuner)', 'Admin User', '2026-04-28 04:19:46', '2026-04-28 04:19:46'),
(8, 'booking', 'Booking created for 5G 4989 by Kaung Khant Mg Mg', 'Admin User', '2026-04-28 07:35:49', '2026-04-28 07:35:49'),
(9, 'vehicle', 'New vehicle added: VHA 1234 (Proton X70)', 'Admin User', '2026-04-29 03:56:33', '2026-04-29 03:56:33'),
(10, 'vehicle', 'New vehicle added: WQ 1 (Toyota Camry)', 'Admin User', '2026-04-29 03:58:28', '2026-04-29 03:58:28'),
(11, 'vehicle', 'New vehicle added: BFE 9090 (Toyota Hiace)', 'Admin User', '2026-04-29 09:23:06', '2026-04-29 09:23:06'),
(12, 'vehicle', 'New vehicle added: WQ 1 (Toyota Camry)', 'Admin User', '2026-04-29 09:28:56', '2026-04-29 09:28:56');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint UNSIGNED NOT NULL,
  `vehicleId` bigint UNSIGNED NOT NULL,
  `driverId` bigint UNSIGNED NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `purpose` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `destination` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `odometerStart` bigint UNSIGNED DEFAULT NULL,
  `odometerEnd` bigint UNSIGNED DEFAULT NULL,
  `checkInAt` datetime DEFAULT NULL,
  `checkOutAt` datetime DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disposals`
--

CREATE TABLE `disposals` (
  `id` bigint UNSIGNED NOT NULL,
  `vehicleId` bigint UNSIGNED NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `evaluationValue` decimal(12,2) DEFAULT NULL,
  `finalValue` decimal(12,2) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `approvedBy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `executedAt` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ic_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `licenseNo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenseExpiry` date NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joinedAt` date DEFAULT NULL,
  `fineCount` int NOT NULL DEFAULT '0',
  `accidentCount` int NOT NULL DEFAULT '0',
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`id`, `name`, `ic_no`, `email`, `phone`, `licenseNo`, `license_type`, `licenseExpiry`, `status`, `department`, `joinedAt`, `fineCount`, `accidentCount`, `image_path`, `created_at`, `updated_at`) VALUES
(6, 'Kaung Khant Mg Mg', '123365478', 'kaungkhant12359@gmail.com', '01137643617', 'D1234567', 'D', '2026-05-20', 'active', 'Operations', '2026-01-28', 2, 3, '/uploads/drivers/1777374111_profile.jpg', '2026-04-28 04:31:53', '2026-04-28 04:31:53');

-- --------------------------------------------------------

--
-- Table structure for table `fines`
--

CREATE TABLE `fines` (
  `id` bigint UNSIGNED NOT NULL,
  `vehicleId` bigint UNSIGNED NOT NULL,
  `driverId` bigint UNSIGNED NOT NULL,
  `offence` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `ticketNo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `insurance_policies`
--

CREATE TABLE `insurance_policies` (
  `id` bigint UNSIGNED NOT NULL,
  `vehicleId` bigint UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `policyNo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` date NOT NULL,
  `expiryDate` date NOT NULL,
  `premium` decimal(10,2) DEFAULT NULL,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `insurance_policies`
--

INSERT INTO `insurance_policies` (`id`, `vehicleId`, `type`, `policyNo`, `provider`, `startDate`, `expiryDate`, `premium`, `document_path`, `created_at`, `updated_at`) VALUES
(6, 11, 'insurance', 'COM-55443322', 'TBA', '2026-04-29', '2026-11-19', 0.00, NULL, '2026-04-29 09:23:06', '2026-04-29 09:23:06'),
(7, 11, 'road_tax', 'ROADTAX-BFE 9090', 'JPJ', '2026-04-29', '2026-11-19', 0.00, NULL, '2026-04-29 09:23:06', '2026-04-29 09:23:06'),
(8, 12, 'insurance', 'VIP-11223344', 'TBA', '2026-04-29', '2027-02-09', 0.00, NULL, '2026-04-29 09:28:56', '2026-04-29 09:28:56'),
(9, 12, 'road_tax', 'ROADTAX-WQ 1', 'JPJ', '2026-04-29', '2027-02-09', 0.00, NULL, '2026-04-29 09:28:56', '2026-04-29 09:28:56'),
(10, 12, 'insurance', 'VIP-11223344', 'Edika', '2027-02-10', '2028-02-11', 5000.00, '/uploads/insurance/1777481032_program_report_years_2026.pdf', '2026-04-29 09:33:33', '2026-04-29 10:13:54');

-- --------------------------------------------------------

--
-- Table structure for table `maintenances`
--

CREATE TABLE `maintenances` (
  `id` bigint UNSIGNED NOT NULL,
  `vehicleId` bigint UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scheduledDate` date NOT NULL,
  `completedDate` date DEFAULT NULL,
  `odometerAt` bigint UNSIGNED DEFAULT NULL,
  `nextServiceOdometer` bigint UNSIGNED DEFAULT NULL,
  `vendor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `cost` decimal(10,2) DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `receipt_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '2026_04_27_144620_create_vehicles_table', 1),
(3, '2026_04_27_145618_create_personal_access_tokens_table', 1),
(4, '2026_04_27_145743_create_drivers_table', 1),
(5, '2026_04_27_145903_create_bookings_table', 1),
(6, '2026_04_27_153354_create_maintenances_table', 1),
(7, '2026_04_27_153412_create_accidents_table', 1),
(8, '2026_04_27_153412_create_insurance_policies_table', 1),
(9, '2026_04_27_153413_create_disposals_table', 1),
(10, '2026_04_27_153413_create_fines_table', 1),
(11, '2026_04_27_153833_create_activities_table', 1),
(12, '2026_04_27_164745_add_images_and_capacity_to_vehicles_and_drivers', 2),
(13, '2026_04_27_165218_add_report_path_to_accidents_table', 3),
(14, '2026_04_27_165407_add_service_tracking_to_vehicles_table', 4),
(15, '2026_04_27_170216_add_ic_and_license_type_to_drivers_table', 5),
(16, '2026_04_28_110800_remove_unused_columns_from_vehicles_table', 6),
(17, '2026_04_28_110840_remove_unused_columns_from_vehicles_table', 6),
(18, '2026_04_28_110900_add_insurance_policy_no_to_vehicles_table', 7),
(19, '2026_04_28_131634_add_receipt_path_to_maintenances_table', 8),
(20, '2026_04_28_131635_add_document_path_to_insurance_policies_table', 8),
(21, '2026_04_28_132530_add_multiple_images_to_accidents_table', 9),
(22, '2026_04_28_132830_sync_initial_insurance_data', 10),
(23, '2026_04_29_163652_add_compliance_docs_to_vehicles_table', 11);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 1, 'auth_token', 'd4ee5afa92be3349cdf898af2f856cd0dd9da6a15f708f45cf5e62e375c73cae', '[\"*\"]', '2026-04-28 04:03:03', NULL, '2026-04-27 09:43:35', '2026-04-28 04:03:03'),
(3, 'App\\Models\\User', 1, 'auth_token', '140e8b211d6407b47962b9f02ce39daebaf568263bfd81c3c34bf1fcc1c4ebe7', '[\"*\"]', '2026-04-28 10:25:24', NULL, '2026-04-28 04:04:15', '2026-04-28 10:25:24'),
(4, 'App\\Models\\User', 1, 'auth_token', '3d4d09fd8f0e9b9a9e97f9732a07478fa0920bb234b103d23ad773b1bd1adf2f', '[\"*\"]', '2026-04-28 10:43:42', NULL, '2026-04-28 10:41:37', '2026-04-28 10:43:42'),
(5, 'App\\Models\\User', 1, 'auth_token', 'eff706296c631718a42d816f16d4e2b6e0690180a81d03a28e250e1154fc0748', '[\"*\"]', '2026-04-28 10:42:05', NULL, '2026-04-28 10:42:04', '2026-04-28 10:42:05'),
(7, 'App\\Models\\User', 1, 'auth_token', 'f3f0c9954fdc5f427a963a5c9c016e9a569baddbae6f32ddee664a23f40fd4c3', '[\"*\"]', '2026-04-29 02:33:21', NULL, '2026-04-28 11:24:11', '2026-04-29 02:33:21'),
(8, 'App\\Models\\User', 1, 'auth_token', '14f8ac57d1c379a87e5f844aaf670dbb880bac9a51df6648e46ab7f1f8642ad3', '[\"*\"]', '2026-04-29 10:14:46', NULL, '2026-04-29 02:47:21', '2026-04-29 10:14:46');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@gmail.com', NULL, '$2y$10$YCXj035EmChcPQZfoemqzO4oUKGmIOmKEgS20fhJxjW00zLLahsvS', 'admin', NULL, '2026-04-27 09:30:25', '2026-04-27 09:30:25'),
(2, 'Test User', 'test@example.com', NULL, '$2y$12$nZ8wV7xJhLVAXcsgdtOnC.qLStRPEcIUcAKJtGZvqjtQvct33ORi6', 'user', NULL, '2026-04-27 09:30:25', '2026-04-27 09:30:25');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` bigint UNSIGNED NOT NULL,
  `regNo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'car',
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `engine` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchaseDate` date DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insuranceExpiry` date DEFAULT NULL,
  `roadTaxExpiry` date DEFAULT NULL,
  `road_tax_ref` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `road_tax_doc_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurance_policy_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurance_provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurance_doc_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_service_date` date DEFAULT NULL,
  `next_service_odometer` bigint UNSIGNED DEFAULT NULL,
  `class` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'department',
  `odometer` bigint UNSIGNED NOT NULL DEFAULT '0',
  `chassisNo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `load` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `regNo`, `type`, `brand`, `model`, `engine`, `purchaseDate`, `status`, `location`, `department`, `insuranceExpiry`, `roadTaxExpiry`, `road_tax_ref`, `road_tax_doc_path`, `insurance_policy_no`, `insurance_provider`, `insurance_doc_path`, `next_service_date`, `next_service_odometer`, `class`, `odometer`, `chassisNo`, `image_path`, `capacity`, `load`, `created_at`, `updated_at`) VALUES
(11, 'BFE 9090', 'Van', 'Toyota', 'Hiace', '1KDFTV445566', '2023-11-20', 'available', 'Branch A', 'Logistics', '2026-11-19', '2026-11-19', NULL, NULL, 'COM-55443322', NULL, NULL, '2026-05-20', 90000, 'department', 85000, 'TRH1234567890LMN', NULL, '3.0L / 12 Pax', '1000 kg', '2026-04-29 09:23:06', '2026-04-29 09:23:06'),
(12, 'WQ 1', 'Car', 'Toyota', 'Camry', '2ARFE987654', '2026-02-10', 'available', 'HQ Putrajaya', 'Management', '2028-02-11', '2027-02-09', NULL, NULL, 'VIP-11223344', NULL, NULL, '2026-08-10', 10000, 'exco', 2500, 'JTD1234567890XYZ', '/uploads/vehicles/1777478209_download (1).jpeg', '2.5L / 5 Pax', '450 kg', '2026-04-29 09:28:56', '2026-04-29 09:50:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accidents`
--
ALTER TABLE `accidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accidents_vehicleid_foreign` (`vehicleId`),
  ADD KEY `accidents_driverid_foreign` (`driverId`);

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_vehicleid_foreign` (`vehicleId`),
  ADD KEY `bookings_driverid_foreign` (`driverId`);

--
-- Indexes for table `disposals`
--
ALTER TABLE `disposals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `disposals_vehicleid_foreign` (`vehicleId`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `drivers_email_unique` (`email`),
  ADD UNIQUE KEY `drivers_licenseno_unique` (`licenseNo`);

--
-- Indexes for table `fines`
--
ALTER TABLE `fines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fines_vehicleid_foreign` (`vehicleId`),
  ADD KEY `fines_driverid_foreign` (`driverId`);

--
-- Indexes for table `insurance_policies`
--
ALTER TABLE `insurance_policies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `insurance_policies_vehicleid_foreign` (`vehicleId`);

--
-- Indexes for table `maintenances`
--
ALTER TABLE `maintenances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maintenances_vehicleid_foreign` (`vehicleId`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicles_regno_unique` (`regNo`),
  ADD UNIQUE KEY `vehicles_chassisno_unique` (`chassisNo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accidents`
--
ALTER TABLE `accidents`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `disposals`
--
ALTER TABLE `disposals`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `fines`
--
ALTER TABLE `fines`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `insurance_policies`
--
ALTER TABLE `insurance_policies`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `maintenances`
--
ALTER TABLE `maintenances`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accidents`
--
ALTER TABLE `accidents`
  ADD CONSTRAINT `accidents_driverid_foreign` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `accidents_vehicleid_foreign` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_driverid_foreign` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_vehicleid_foreign` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `disposals`
--
ALTER TABLE `disposals`
  ADD CONSTRAINT `disposals_vehicleid_foreign` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fines`
--
ALTER TABLE `fines`
  ADD CONSTRAINT `fines_driverid_foreign` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fines_vehicleid_foreign` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `insurance_policies`
--
ALTER TABLE `insurance_policies`
  ADD CONSTRAINT `insurance_policies_vehicleid_foreign` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `maintenances`
--
ALTER TABLE `maintenances`
  ADD CONSTRAINT `maintenances_vehicleid_foreign` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
