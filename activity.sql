-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2024 at 02:58 PM
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

--
-- Dumping data for table `approvers`
--

INSERT INTO `approvers` (`id`, `name`, `email`, `phone`, `address`, `aadhar`, `createdAt`, `updatedAt`) VALUES
(8, 'vaibhav', 'vaibhav40@gmail.com', '6352902329', 'BNP', '656598982332', '2024-06-04 05:21:20', '2024-06-04 05:21:20');

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
(33, 'Cleaning', '2024-05-29 06:42:42', '2024-06-05 12:46:25', 0),
(34, 'Feeding Poor', '2024-05-29 06:42:50', '2024-06-05 12:46:27', 0),
(35, 'Gardening', '2024-05-29 06:43:00', '2024-06-05 12:46:43', 0),
(36, 'Marathon', '2024-05-29 06:43:09', '2024-06-04 12:12:01', 1),
(37, 'Plantation', '2024-05-29 06:43:24', '2024-06-04 12:12:03', 1),
(38, 'Teaching', '2024-05-29 06:43:31', '2024-06-05 12:46:37', 0),
(39, 'New tech', '2024-06-03 12:58:55', '2024-06-03 12:58:55', 1),
(40, 'PCB', '2024-06-03 12:59:05', '2024-06-03 12:59:05', 1),
(41, 'Sensor', '2024-06-03 13:00:19', '2024-06-05 12:46:49', 0),
(42, 'Tree Plantation Awareness', '2024-06-05 12:45:15', '2024-06-05 12:45:15', 1),
(43, 'Running Marathon', '2024-06-05 12:45:33', '2024-06-05 12:45:33', 1);

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
(1, 'dwarka dham', 1, '2024-05-23 12:12:30', '2024-06-03 13:41:14'),
(2, 'karond', 1, '2024-05-23 13:21:06', '2024-06-03 13:41:15'),
(3, 'BNP', 1, '2024-06-02 06:36:33', '2024-06-03 13:41:16');

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
(123, 186, 'photo-1717335448433-892819609.jpg', '', '2024-06-02 00:00:00', 'Gardening', '04:53:00', 23.3084, 77.3743, 3, 1),
(124, 186, 'photo-1717335721584-117694400.jpg', '', '2024-06-02 00:00:00', 'Feeding Poor', '02:00:00', 23.3084, 77.3743, 3, 1),
(125, 186, 'photo-1717335848007-5107162.jpg', '', '2024-06-01 00:00:00', 'Cleaning', '06:00:00', 23.3084, 77.3743, 3, 1),
(126, 187, 'photo-1717412528621-750894354.jpg', '', '2024-06-02 00:00:00', 'Cleaning', '07:00:00', 23.3084, 77.3743, 3, 1),
(127, 188, 'photo-1717412826659-940422371.jpg', '', '2024-06-02 00:00:00', 'Cleaning', '03:04:00', 23.3084, 77.3743, 3, 1),
(128, 188, 'photo-1717417994101-674194158.jpg', '', '2024-06-02 00:00:00', 'Marathon', '04:01:00', 23.3084, 77.3743, 3, 0),
(129, 190, 'photo-1717418064945-836626739.jpg', '', '2024-06-02 00:00:00', 'Plantation', '02:00:00', 23.3084, 77.3743, 3, 0),
(130, 191, 'photo-1717418103876-208810128.jpg', '', '2024-06-02 00:00:00', 'Teaching', '03:00:00', 23.3084, 77.3743, 3, 0),
(131, 191, 'photo-1717570122133-993949343.jpg', '', '2024-06-02 00:00:00', 'Cleaning', '03:00:00', 23.3084, 77.3743, 3, 0),
(132, 203, 'photo-1717592535615-293792940.jpg', '', '2024-06-05 00:00:00', 'Tree Plantation Awareness', '03:05:00', 22.7464, 77.734, 3, 0),
(133, 203, 'photo-1717592830300-179981651.jpg', '', '2024-06-05 00:00:00', 'Running Marathon', '05:00:00', 22.7464, 77.734, 3, 0),
(134, 187, 'photo-1717598293255-140864572.jpeg', 'video-1717598293256-931705762.mp4', '2024-06-05 00:00:00', 'Plantation', '03:02:00', 23.5413, 80.8544, 3, 0),
(135, 142, 'photo-1717652690556-628449150.avif', 'video-1717652690557-731888052.mp4', '2024-06-03 00:00:00', 'Others', '01:01:00', 22.7464, 77.734, 3, 0),
(136, 191, 'photo-1717679949343-766563874.avif', '', '2024-06-03 00:00:00', 'Marathon', '02:05:00', 22.7464, 77.734, 0, 0),
(137, 203, 'photo-1717756223330-834519646.avif', '', '2024-06-07 00:00:00', 'Tree Plantation Awareness', '03:51:00', 22.7464, 77.734, 0, 0),
(138, 203, 'photo-1717756246033-2029143.avif', '', '2024-06-06 00:00:00', 'Running Marathon', '06:03:00', 22.7464, 77.734, 0, 0),
(139, 203, 'photo-1717756295263-904626035.jpg', '', '2024-06-07 00:00:00', 'Marathon', '03:07:00', 22.7464, 77.734, 0, 0);

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
(186, 'Vaibhav Kurmi', 'vaibhavkurmi786@gmail.com', '123', 0, '', 'photo-1717335273820-828200820.jpg', '[\"Cleaning\",\"Feeding Poor\",\"Gardening\"]', '', '6352902329', '', 1, '660354', 'user', 'karond', '986532986532'),
(187, 'Nimo', 'nimo@gmail.com', '123', 0, '', 'photo-1717412444469-430480943.jpg', '[\"Cleaning\",\"Feeding Poor\",\"Plantation\",\"Teaching\"]', '', '7186352114', '', 1, '', 'user', 'karond', '447758699966'),
(188, 'rajat', 'rajat@fmail.com', '123', 0, '', 'photo-1717412677065-564767628.jpg', '[\"Cleaning\",\"Marathon\",\"Gardening\",\"Teaching\"]', '', '8319621525', '', 1, '', 'user', 'dwarka dham', '526023654563'),
(189, 'CC', 'cc@gmail.com', '123', 0, '', 'photo-1717417443443-531048745.jpg', '[\"Marathon\",\"Plantation\",\"Teaching\",\"Cleaning\",\"Feeding Poor\",\"Gardening\"]', '', '9965874523', '', 1, '', 'user', 'dwarka dham', '526023654566'),
(190, 'fifi', 'fifi@gmail.com', '123', 0, '', 'photo-1717417519524-428789870.jpg', '[\"Cleaning\",\"Marathon\",\"Feeding Poor\",\"Plantation\",\"Gardening\",\"Teaching\"]', '', '6352907878', '', 1, '', 'user', 'dwarka dham', '61258'),
(191, 'lomdi', 'lomdi@gmail.com', '123', 0, '', 'photo-1717417851611-733540956.jpg', '[\"Cleaning\",\"Marathon\",\"Feeding Poor\",\"Plantation\",\"Gardening\",\"Teaching\"]', '', '7878685423', '', 1, '', 'user', 'dwarka dham', '123123123121'),
(192, 'mohini', 'mohini@mistpl.com', 'zxc*123123', 0, '', 'photo-1717476262990-293450595.jpg', '[\"Cleaning\"]', '', '5554865795', '2965e6e67d7938bc007065dee90a780826fdff28', 0, '', 'user', 'dwarka dham', '784512986532'),
(199, 'kamlesh', 'kamlesh@gmail.com', 'zxc*123123', 0, '', 'photo-1717567397231-720374479.jpeg', '[\"Feeding Poor\",\"Others\"]', '', '7073610334', 'ccd639c8ba3671d979046445a6c8f17a8464df3b', 0, '', 'user', 'karond', '652652652652'),
(202, 'Obsessive Gamerz', 'vaibhavkurmi76@gmail.com', 'LCFQwK(wNG', 0, '114753101440871717037', '114753101440871717037', '[\"Others\"]', '', NULL, '', 1, '', 'user', 'NA', ''),
(203, 'mithi', 'mithi@gmail.com', '123', 0, '', 'photo-1717592392508-900483478.jpeg', '[\"Tree Plantation Awareness\",\"Running Marathon\",\"Others\"]', '', '1231231231', '', 1, '', 'user', 'dwarka dham', '784512986537');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `endorsements`
--
ALTER TABLE `endorsements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

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
