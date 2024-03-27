-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 11, 2024 at 07:26 AM
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
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `photos` varchar(200) NOT NULL,
  `videos` varchar(200) NOT NULL,
  `Date` datetime NOT NULL DEFAULT current_timestamp(),
  `category` varchar(200) NOT NULL,
  `totalTime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`Id`, `UserId`, `photos`, `videos`, `Date`, `category`, `totalTime`) VALUES
(49, 106, 'photo-1709816497853-27692801.jpg', 'video-1709816497970-710922567.mp4', '2024-03-07 13:01:42', '\"Cleaning\"', '01:01:00'),
(51, 106, 'photo-1709876432634-411030587.jpg', 'video-1709876432636-902871785.mp4', '2024-03-08 05:40:34', '\"Cleaning\"', '03:01:00'),
(52, 106, 'photo-1709881250539-508465534.jpg', 'video-1709881250856-929760163.mp4', '2024-03-08 07:00:54', '\"Teaching Poor\"', '01:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `post_categories`
--

CREATE TABLE `post_categories` (
  `Id` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `PostId` int(11) NOT NULL,
  `InsertedTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_images`
--

CREATE TABLE `post_images` (
  `Id` int(11) NOT NULL,
  `Image` varchar(1000) NOT NULL,
  `PostId` int(11) NOT NULL,
  `InsertedTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_videos`
--

CREATE TABLE `post_videos` (
  `Id` int(11) NOT NULL,
  `Video` varchar(1000) NOT NULL,
  `PostId` int(11) NOT NULL,
  `InsertedTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(121) NOT NULL,
  `email` varchar(112) NOT NULL,
  `roll` int(11) NOT NULL,
  `password` varchar(11) NOT NULL,
  `jwt` int(100) NOT NULL,
  `photo` varchar(121) NOT NULL,
  `category` varchar(121) NOT NULL,
  `access_token` varchar(112) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `roll`, `password`, `jwt`, `photo`, `category`, `access_token`) VALUES
(4, 'shubham', 'shubhamjadon06@gmail.com', 0, '123456', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLfVdAFlFDV8wPOybDsM7XGec8NZfM_nkJTU4EOWWivB8i6=s96-c', '', ''),
(31, 'Shubham Jadon', 'shubhamjadon05@gmail.com', 0, '', 0, 'https://lh3.googleusercontent.com/a/ACg8ocLfVdAFlFDV8wPOybDsM7XGec8NZfM_nkJTU4EOWWivB8i6=s96-c', '', 'ya29.a0AfB_byCOaAoPIM-qa8pe2MqlurJ2zq6_rvPwOSMZGu0m75Ad-0X0bfv5_jFLYcdo_JNML_Hlj-7r4tuITmvnnejYpZekFfCl4_AH_nupo'),
(38, 'sdsdsd', 'shubham3434sadsa', 0, '', 0, '', '', ''),
(39, 'sdsdsd', 'shubham3434sadsa', 0, '', 0, '', '', ''),
(40, 'Shubam Jadon', 'shubham@mistpl.com', 0, '', 1, 'https://lh3.googleusercontent.com/a/ACg8ocItbCEicrJ1AB82qpou4Pft0DuMK3pU3tvprsOhYNo8=s96-c', '', ''),
(41, 'shubham', 'sdsad@gmial.com', 0, '', 0, '', '', ''),
(42, 'shubham', 'sdsad@8gmial.com', 0, '', 0, '', '', ''),
(43, 'aman', 'aman@gmail.com', 0, '123', 0, '', '', ''),
(48, 'a', 'shubham@gmail.com', 0, '123456', 0, '', '', ''),
(49, 'uttkarsh', 'uttkarsh@gmail.com', 0, '123456', 0, '', '', ''),
(50, '', '', 0, '', 0, '', '', ''),
(51, 'shubham', 'sdsad@gmial.com', 0, '123', 0, '', '', ''),
(56, 'jcdhc', 'sdsad@gmial.com', 0, '123', 0, '', '', ''),
(57, 'shourya', 'shourya@23gmail.com', 0, '123', 0, '', '', ''),
(58, 'dcdscsd', 'ccd@33gmail.com', 0, '111', 0, '', '', ''),
(59, '', '', 0, '', 0, '', '', ''),
(60, '', '', 0, '', 0, '', '', ''),
(61, '', '', 0, '', 0, '', '', ''),
(62, 'abc', '', 0, '', 0, '', '', ''),
(63, '', '', 0, '', 0, 'Screenshot (14).png', '', ''),
(64, '', '', 0, '', 0, '', '', ''),
(65, '', '', 0, '', 0, '', '', ''),
(66, 'for pics', 'picture@23gmail.com', 0, '111', 0, 'Screenshot (14).png', '', ''),
(67, 'puneet sharma', 'puneet@mistpl.com', 0, '123456', 0, 'Screenshot (19).png', '', ''),
(68, '', '', 0, '', 0, '', '', ''),
(69, '', '', 0, '', 0, '', '', ''),
(71, 'aman 99', 'aman99992@gmail.com', 0, '123', 0, 'Screenshot (14).png', '[\"Teaching kids\",\"Running a marathon\",\"Blood Donation\"]', ''),
(72, 'Puneet Sharma', 'Puneetsharma@gmail.com', 0, '123456', 0, 'Screenshot (14).png', '[\"Teaching kids\",\"Local cleaning\",\"Running a marathon\"]', ''),
(73, 'shubham jadon', 'shubhamjadon05@gmail.com', 0, '123456', 0, 'Screenshot (14).png', '[\"Planting tree\",\"Teaching kids\",\"Local cleaning\",\"  Feeding the poor\"]', ''),
(74, '', '', 0, '', 0, '', '[]', ''),
(75, 'shubh', 'shubh@10.com', 0, '123456', 0, '', '[\"Planting tree\"]', ''),
(76, '', '', 0, '', 0, '', '[]', ''),
(77, '', '', 0, '', 0, '', '[]', ''),
(78, '', '', 0, '', 0, '', '[]', ''),
(79, 'Puneet sharma ', 'ponshar@yahoo.com', 0, '123456', 0, 'Screenshot (14).png', '[\"Teaching kids\",\"  Feeding the poor\",\"Local cleaning\"]', ''),
(80, 'aman', 'aman123@gmail.com', 0, 'amangupta', 0, 'image_2023_12_07T07_50_07_111Z.png', '[\"Planting tree\"]', ''),
(106, 'vaibhav', 'vaibhav@gmail.com', 0, '1212', 0, 'photo-1709816022021-37332573.jpg', '[\"Planting tree\",\"Feeding the poor\",\"Teaching Kids\",\"Local Cleaning\"]', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `post-user-id` (`UserId`);

--
-- Indexes for table `post_categories`
--
ALTER TABLE `post_categories`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `post-cat` (`PostId`);

--
-- Indexes for table `post_images`
--
ALTER TABLE `post_images`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `post-image` (`PostId`);

--
-- Indexes for table `post_videos`
--
ALTER TABLE `post_videos`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `post-video` (`PostId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `post_categories`
--
ALTER TABLE `post_categories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `post_images`
--
ALTER TABLE `post_images`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `post_videos`
--
ALTER TABLE `post_videos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `post-user-id` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `post_categories`
--
ALTER TABLE `post_categories`
  ADD CONSTRAINT `post-cat` FOREIGN KEY (`PostId`) REFERENCES `posts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_images`
--
ALTER TABLE `post_images`
  ADD CONSTRAINT `post-image` FOREIGN KEY (`PostId`) REFERENCES `posts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_videos`
--
ALTER TABLE `post_videos`
  ADD CONSTRAINT `post-video` FOREIGN KEY (`PostId`) REFERENCES `posts` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
