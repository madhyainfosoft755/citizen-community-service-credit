-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2024 at 08:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
-- Table structure for table `endorsements`
--

CREATE TABLE `endorsements` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `endorsements`
--

INSERT INTO `endorsements` (`id`, `userId`, `postId`) VALUES
(5, 107, 74),
(6, 106, 72),
(7, 106, 73),
(8, 106, 74),
(10, 109, 71),
(11, 109, 72),
(12, 109, 73),
(17, 110, 71),
(18, 110, 72),
(19, 110, 73),
(20, 110, 74),
(21, 107, 71),
(22, 107, 76);

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
  `endorsementCounter` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`Id`, `UserId`, `photos`, `videos`, `Date`, `category`, `totalTime`, `latitude`, `longitude`, `endorsementCounter`) VALUES
(70, 106, 'photo-1711692072455-234843425.jpg', 'video-1711692072898-156230631.mp4', '2024-03-29 06:01:13', 'Gardening', '01:00:00', 23.0425, 75.3762, 0),
(71, 106, 'photo-1711696413216-40772446.jpg', 'video-1711696413278-167126182.mp4', '2024-03-29 07:13:34', 'Gardening', '01:00:00', 23.3084, 77.3743, 3),
(72, 107, 'photo-1712142022462-435026876.jpg', 'video-1712142022469-552089935.mp4', '2024-04-03 11:00:29', 'Gardening', '01:00:00', 23.3084, 77.3743, 3),
(73, 107, 'photo-1712142161110-283288439.jpg', 'video-1712142161521-344809129.mp4', '2024-04-03 11:02:48', 'Cleaning', '00:25:00', 23.3084, 77.3743, 3),
(74, 109, 'photo-1712148493625-300626373.jpg', 'video-1712148493662-480019915.mp4', '2024-04-03 12:48:14', 'Teaching Poor', '01:00:00', 23.3084, 77.3743, 3),
(76, 106, 'photo-1713178686602-314091983.jpg', 'video-1713178686620-347046148.mp4', '2024-04-15 10:58:09', 'Gardening', '01:00:00', 23.3084, 77.3743, 1),
(78, 106, 'photo-1713444904533-994936569.jpg', 'video-1713444904605-46691456.mp4', '2024-04-18 12:55:06', 'Gardening', '01:00:00', 23.3084, 77.3743, 0);

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
  `googleId` varchar(255) NOT NULL,
  `photo` varchar(121) NOT NULL,
  `category` varchar(121) NOT NULL,
  `access_token` varchar(112) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `verificationToken` varchar(255) NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `resetPin` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `roll`, `password`, `jwt`, `googleId`, `photo`, `category`, `access_token`, `phone`, `verificationToken`, `verified`, `resetPin`) VALUES
(106, 'vaibhav', 'vaibhav@gmail.com', 0, '1414', 0, '', 'photo-1709816022021-37332573.jpg', '[\"Planting tree\",\"Feeding the poor\",\"Teaching Kids\",\"Local Cleaning\"]', '', '0', '', 0, ''),
(107, 'Vaibhav Kurmi', 'vaibhavkurmi786@gmail.com', 0, '1414', 0, '', 'photo-1711711742460-555957938.jpg', '[\"Planting tree\",\"Feeding the poor\",\"Teaching Kids\",\"Local Cleaning\"]', '', '0', '', 1, '070507'),
(109, 'utkarsh', 'utkarsh@mistpl.com', 0, '123', 0, '', 'photo-1712148321209-824773025.jpg', '[\"Teaching Kids\",\"Local Cleaning\",\"Planting tree\",\"Feeding the poor\"]', '', '0', '', 0, ''),
(110, 'aman', 'aman@gmail.com', 0, '123', 0, '', 'photo-1712642777613-449121707.jpg', '[\"Planting tree\",\"Feeding the poor\",\"Teaching Kids\",\"Local Cleaning\"]', '', '0', '', 0, ''),
(113, 'minal', 'minal@gmail.com', 0, '123', 0, '', 'photo-1712755182428-542987.jpg', '[\"Teaching Kids\"]', '', '7186352114', '', 0, ''),
(115, 'naman', 'naman@gmail.com', 0, '123', 0, '', 'photo-1712828248048-142997558.jpg', '[\"Planting tree\"]', '', '9854785632', '', 0, ''),
(116, 'Info', 'info@mistpl.com', 0, '123', 0, '', 'photo-1712905391379-485543407.jpg', '[\"Planting tree\",\"Feeding the poor\",\"Teaching Kids\",\"Local Cleaning\"]', '', '1122334455', '', 0, ''),
(122, 'Obsessive Gamerz', 'vaibhavkurmi76@gmail.com', 0, 'Flvw^QnckI', 0, '114753101440871717037', 'https://lh3.googleusercontent.com/a/ACg8ocIFcGFnUMamuk3oFDhf9LW9Ht7oxGZqYCX272IkoJt7conIuWKN=s96-c', '', '', '', '', 0, ''),
(123, 'Vaibhav Kurmi', 'vaibhavkurmi39@gmail.com', 0, 'QAK)FCMUpX', 0, '109973929811690752331', 'https://lh3.googleusercontent.com/a/ACg8ocJjH_403mxXEa543V6rUXeDlQ8IuacRVksZJVCKoPvsOxrNWA=s96-c', '', '', '', '', 0, ''),
(124, 'utkarsh', 'utkarshd@gmail.com', 0, '123', 0, '', 'photo-1714119346888-667757353.jpg', '[\"Teaching Kids\",\"Planting tree\",\"Feeding the poor\",\"Local Cleaning\"]', '', '7845127845', '', 0, ''),
(133, 'vaishu', 'littlepalx42@gmail.com', 0, '1414', 0, '', 'photo-1714458205621-985899029.png', '[\"Planting tree\",\"Teaching Kids\",\"Feeding the poor\",\"Local Cleaning\"]', '', '7073610334', '', 1, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `endorsements`
--
ALTER TABLE `endorsements`
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
-- AUTO_INCREMENT for table `endorsements`
--
ALTER TABLE `endorsements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

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
