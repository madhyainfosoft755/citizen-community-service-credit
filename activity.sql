-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2024 at 04:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `activity`
--

-- --------------------------------------------------------

--
-- Table structure for table `approvers`
--

CREATE TABLE `approvers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `aadhar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isEnabled` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`, `isEnabled`) VALUES
(33, 'Cleaning', '2024-05-29 06:42:42', '2024-05-31 14:01:48', 1),
(34, 'Feeding Poor', '2024-05-29 06:42:50', '2024-05-31 14:06:49', 1),
(35, 'Gardening', '2024-05-29 06:43:00', '2024-05-31 14:01:16', 0),
(36, 'Marathon', '2024-05-29 06:43:09', '2024-05-31 14:01:17', 0),
(37, 'Plantation', '2024-05-29 06:43:24', '2024-05-31 13:58:27', 0),
(38, 'Teaching', '2024-05-29 06:43:31', '2024-05-31 13:58:27', 0);

-- --------------------------------------------------------

--
-- Table structure for table `endorsements`
--

CREATE TABLE `endorsements` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `isEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `name`, `isEnabled`, `createdAt`, `updatedAt`) VALUES
(1, 'dwarka dham', 1, '2024-05-23 12:12:30', '2024-05-31 14:21:36'),
(2, 'karond', 1, '2024-05-23 13:21:06', '2024-05-31 14:21:37');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `photos` varchar(200) NOT NULL,
  `videos` varchar(200) NOT NULL,
  `Date` datetime NOT NULL DEFAULT current_timestamp(),
  `category` varchar(200) NOT NULL,
  `totalTime` time NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `endorsementCounter` int(1) NOT NULL,
  `approved` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`Id`, `UserId`, `photos`, `videos`, `Date`, `category`, `totalTime`, `latitude`, `longitude`, `endorsementCounter`, `approved`) VALUES
(122, 183, 'photo-1717073521129-165979368.jpg', '', '2024-05-08 00:00:00', 'Cleaning', '03:00:00', 23.3084, 77.3743, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(121) NOT NULL,
  `email` varchar(112) NOT NULL,
  `password` varchar(11) NOT NULL,
  `confirm` tinyint(1) NOT NULL,
  `googleId` varchar(255) NOT NULL,
  `photo` varchar(121) NOT NULL,
  `category` varchar(121) NOT NULL,
  `access_token` varchar(112) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `verificationToken` varchar(255) NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `resetPin` varchar(10) NOT NULL,
  `role` varchar(255) NOT NULL,
  `organization` varchar(255) NOT NULL DEFAULT 'NA',
  `aadhar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `confirm`, `googleId`, `photo`, `category`, `access_token`, `phone`, `verificationToken`, `verified`, `resetPin`, `role`, `organization`, `aadhar`) VALUES
(142, 'Info', 'info@mistpl.com', '123', 0, '', 'photo-1715147769219-326137111.jpg', '[\"Teaching Kids\",\"Planting tree\",\"Feeding the poor\",\"Blood Donation\",\"Running a marathon\",\"Local Cleaning\"]', '', '1144632587', '', 1, '', 'admin', '', ''),
(183, 'Vaibhav Kurmi', 'vaibhavkurmi786@gmail.com', '123', 0, '', 'photo-1717071506882-251020584.jpg', '[\"Cleaning\",\"Marathon\"]', '', '6352902329', '0f383dc7ea75abfda3b9e42f0261ff59d78440b9', 1, '', 'user', 'dwarka dham', '986532986532'),
(184, 'Obsessive Gamerz', 'vaibhavkurmi76@gmail.com', 'K*9azSbXRY', 0, '114753101440871717037', '114753101440871717037', '', '', NULL, '', 1, '', 'user', 'NA', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approvers`
--
ALTER TABLE `approvers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `endorsements`
--
ALTER TABLE `endorsements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `post-user-id` (`UserId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `approvers`
--
ALTER TABLE `approvers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `endorsements`
--
ALTER TABLE `endorsements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `post-user-id` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
