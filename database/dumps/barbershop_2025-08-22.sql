-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2025 at 01:45 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

--
-- Dumping data for table `pma__export_templates`
--

INSERT INTO `pma__export_templates` (`id`, `username`, `export_type`, `template_name`, `template_data`) VALUES
(1, 'root', 'server', 'SaloonDatabase', '{\"quick_or_custom\":\"quick\",\"what\":\"sql\",\"db_select[]\":[\"phpmyadmin\",\"salon_app\",\"test\"],\"aliases_new\":\"\",\"output_format\":\"sendit\",\"filename_template\":\"@SERVER@\",\"remember_template\":\"on\",\"charset\":\"utf-8\",\"compression\":\"none\",\"maxsize\":\"\",\"codegen_structure_or_data\":\"data\",\"codegen_format\":\"0\",\"csv_separator\":\",\",\"csv_enclosed\":\"\\\"\",\"csv_escaped\":\"\\\"\",\"csv_terminated\":\"AUTO\",\"csv_null\":\"NULL\",\"csv_columns\":\"something\",\"csv_structure_or_data\":\"data\",\"excel_null\":\"NULL\",\"excel_columns\":\"something\",\"excel_edition\":\"win\",\"excel_structure_or_data\":\"data\",\"json_structure_or_data\":\"data\",\"json_unicode\":\"something\",\"latex_caption\":\"something\",\"latex_structure_or_data\":\"structure_and_data\",\"latex_structure_caption\":\"Structure of table @TABLE@\",\"latex_structure_continued_caption\":\"Structure of table @TABLE@ (continued)\",\"latex_structure_label\":\"tab:@TABLE@-structure\",\"latex_relation\":\"something\",\"latex_comments\":\"something\",\"latex_mime\":\"something\",\"latex_columns\":\"something\",\"latex_data_caption\":\"Content of table @TABLE@\",\"latex_data_continued_caption\":\"Content of table @TABLE@ (continued)\",\"latex_data_label\":\"tab:@TABLE@-data\",\"latex_null\":\"\\\\textit{NULL}\",\"mediawiki_structure_or_data\":\"data\",\"mediawiki_caption\":\"something\",\"mediawiki_headers\":\"something\",\"htmlword_structure_or_data\":\"structure_and_data\",\"htmlword_null\":\"NULL\",\"ods_null\":\"NULL\",\"ods_structure_or_data\":\"data\",\"odt_structure_or_data\":\"structure_and_data\",\"odt_relation\":\"something\",\"odt_comments\":\"something\",\"odt_mime\":\"something\",\"odt_columns\":\"something\",\"odt_null\":\"NULL\",\"pdf_report_title\":\"\",\"pdf_structure_or_data\":\"data\",\"phparray_structure_or_data\":\"data\",\"sql_include_comments\":\"something\",\"sql_header_comment\":\"\",\"sql_use_transaction\":\"something\",\"sql_compatibility\":\"NONE\",\"sql_structure_or_data\":\"structure_and_data\",\"sql_create_table\":\"something\",\"sql_auto_increment\":\"something\",\"sql_create_view\":\"something\",\"sql_create_trigger\":\"something\",\"sql_backquotes\":\"something\",\"sql_type\":\"INSERT\",\"sql_insert_syntax\":\"both\",\"sql_max_query_size\":\"50000\",\"sql_hex_for_binary\":\"something\",\"sql_utc_time\":\"something\",\"texytext_structure_or_data\":\"structure_and_data\",\"texytext_null\":\"NULL\",\"yaml_structure_or_data\":\"data\",\"\":null,\"as_separate_files\":null,\"csv_removeCRLF\":null,\"excel_removeCRLF\":null,\"json_pretty_print\":null,\"htmlword_columns\":null,\"ods_columns\":null,\"sql_dates\":null,\"sql_relation\":null,\"sql_mime\":null,\"sql_disable_fk\":null,\"sql_views_as_tables\":null,\"sql_metadata\":null,\"sql_drop_database\":null,\"sql_drop_table\":null,\"sql_if_not_exists\":null,\"sql_simple_view_export\":null,\"sql_view_current_user\":null,\"sql_or_replace_view\":null,\"sql_procedure_function\":null,\"sql_truncate\":null,\"sql_delayed\":null,\"sql_ignore\":null,\"texytext_columns\":null}'),
(2, 'root', 'server', 'barbershop_2025-08-22.sql', '{\"quick_or_custom\":\"quick\",\"what\":\"sql\",\"db_select[]\":[\"phpmyadmin\",\"salon_app\",\"test\"],\"aliases_new\":\"\",\"output_format\":\"sendit\",\"filename_template\":\"@SERVER@\",\"remember_template\":\"on\",\"charset\":\"utf-8\",\"compression\":\"none\",\"maxsize\":\"\",\"codegen_structure_or_data\":\"data\",\"codegen_format\":\"0\",\"csv_separator\":\",\",\"csv_enclosed\":\"\\\"\",\"csv_escaped\":\"\\\"\",\"csv_terminated\":\"AUTO\",\"csv_null\":\"NULL\",\"csv_columns\":\"something\",\"csv_structure_or_data\":\"data\",\"excel_null\":\"NULL\",\"excel_columns\":\"something\",\"excel_edition\":\"win\",\"excel_structure_or_data\":\"data\",\"json_structure_or_data\":\"data\",\"json_unicode\":\"something\",\"latex_caption\":\"something\",\"latex_structure_or_data\":\"structure_and_data\",\"latex_structure_caption\":\"Structure of table @TABLE@\",\"latex_structure_continued_caption\":\"Structure of table @TABLE@ (continued)\",\"latex_structure_label\":\"tab:@TABLE@-structure\",\"latex_relation\":\"something\",\"latex_comments\":\"something\",\"latex_mime\":\"something\",\"latex_columns\":\"something\",\"latex_data_caption\":\"Content of table @TABLE@\",\"latex_data_continued_caption\":\"Content of table @TABLE@ (continued)\",\"latex_data_label\":\"tab:@TABLE@-data\",\"latex_null\":\"\\\\textit{NULL}\",\"mediawiki_structure_or_data\":\"data\",\"mediawiki_caption\":\"something\",\"mediawiki_headers\":\"something\",\"htmlword_structure_or_data\":\"structure_and_data\",\"htmlword_null\":\"NULL\",\"ods_null\":\"NULL\",\"ods_structure_or_data\":\"data\",\"odt_structure_or_data\":\"structure_and_data\",\"odt_relation\":\"something\",\"odt_comments\":\"something\",\"odt_mime\":\"something\",\"odt_columns\":\"something\",\"odt_null\":\"NULL\",\"pdf_report_title\":\"\",\"pdf_structure_or_data\":\"data\",\"phparray_structure_or_data\":\"data\",\"sql_include_comments\":\"something\",\"sql_header_comment\":\"\",\"sql_use_transaction\":\"something\",\"sql_compatibility\":\"NONE\",\"sql_structure_or_data\":\"structure_and_data\",\"sql_create_table\":\"something\",\"sql_auto_increment\":\"something\",\"sql_create_view\":\"something\",\"sql_create_trigger\":\"something\",\"sql_backquotes\":\"something\",\"sql_type\":\"INSERT\",\"sql_insert_syntax\":\"both\",\"sql_max_query_size\":\"50000\",\"sql_hex_for_binary\":\"something\",\"sql_utc_time\":\"something\",\"texytext_structure_or_data\":\"structure_and_data\",\"texytext_null\":\"NULL\",\"yaml_structure_or_data\":\"data\",\"\":null,\"as_separate_files\":null,\"csv_removeCRLF\":null,\"excel_removeCRLF\":null,\"json_pretty_print\":null,\"htmlword_columns\":null,\"ods_columns\":null,\"sql_dates\":null,\"sql_relation\":null,\"sql_mime\":null,\"sql_disable_fk\":null,\"sql_views_as_tables\":null,\"sql_metadata\":null,\"sql_drop_database\":null,\"sql_drop_table\":null,\"sql_if_not_exists\":null,\"sql_simple_view_export\":null,\"sql_view_current_user\":null,\"sql_or_replace_view\":null,\"sql_procedure_function\":null,\"sql_truncate\":null,\"sql_delayed\":null,\"sql_ignore\":null,\"texytext_columns\":null}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Table structure for table `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Dumping data for table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"salon_app\",\"table\":\"sale_payments\"},{\"db\":\"salon_app\",\"table\":\"sale_items\"},{\"db\":\"salon_app\",\"table\":\"sales\"},{\"db\":\"salon_app\",\"table\":\"customers\"},{\"db\":\"salon_app\",\"table\":\"contact_messages\"},{\"db\":\"salon_app\",\"table\":\"contact_information\"},{\"db\":\"salon_app\",\"table\":\"salons\"},{\"db\":\"salon_app\",\"table\":\"services\"},{\"db\":\"salon_app\",\"table\":\"migrations\"},{\"db\":\"salon_app\",\"table\":\"deals\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Dumping data for table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2025-08-22 11:32:15', '{\"Console\\/Mode\":\"collapse\"}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indexes for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indexes for table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indexes for table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indexes for table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indexes for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indexes for table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indexes for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indexes for table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indexes for table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indexes for table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indexes for table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indexes for table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indexes for table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `salon_app`
--
CREATE DATABASE IF NOT EXISTS `salon_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `salon_app`;

-- --------------------------------------------------------

--
-- Table structure for table `about_us`
--

CREATE TABLE `about_us` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `heading` varchar(255) DEFAULT NULL,
  `paragraph` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about_us`
--

INSERT INTO `about_us` (`id`, `heading`, `paragraph`, `created_at`, `updated_at`) VALUES
(2, 'This is Our First Experience', 'Our master barbers bring decades of combined experience, staying current with the latest trends and timeless techniques.', '2025-08-21 21:32:13', '2025-08-21 21:32:13');

-- --------------------------------------------------------

--
-- Table structure for table `about_us_features`
--

CREATE TABLE `about_us_features` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `barber` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `name`, `email`, `phone`, `service`, `appointment_date`, `appointment_time`, `barber`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'Sajawal ali Sajawal ali', 'sajawaali7886@gmail.com', '03212328397', 'head-massage', '2025-08-30', '17:30:00', 'james', NULL, '2025-08-21 20:27:37', '2025-08-21 20:27:37');

-- --------------------------------------------------------

--
-- Table structure for table `barbers`
--

CREATE TABLE `barbers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_data` longtext DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `specialties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specialties`)),
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `social_media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_media`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `salon_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `barbers`
--

INSERT INTO `barbers` (`id`, `name`, `position`, `bio`, `image`, `image_data`, `experience`, `specialties`, `phone`, `email`, `social_media`, `is_active`, `sort_order`, `salon_id`, `created_at`, `updated_at`) VALUES
(1, 'Alex', 'Master Barber', 'Meet to our special Barber', NULL, 'data:image/jpeg;base64,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', '1+ Years', '[\"Cuttting , Spaw\"]', NULL, NULL, '{\"instagram\":null,\"facebook\":null,\"twitter\":null}', 1, 0, NULL, '2025-08-21 21:20:01', '2025-08-21 21:20:01');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Cutting', 1, '2025-08-21 21:24:58', '2025-08-21 21:24:58'),
(2, 'Hair Color', 1, '2025-08-21 21:25:17', '2025-08-21 21:25:17');

-- --------------------------------------------------------

--
-- Table structure for table `contact_information`
--

CREATE TABLE `contact_information` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `business_hours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`business_hours`)),
  `additional_info` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_information`
--

INSERT INTO `contact_information` (`id`, `business_name`, `address`, `phone`, `email`, `website`, `business_hours`, `additional_info`, `created_at`, `updated_at`) VALUES
(1, 'Dubai Saloon', 'Lahore DHA Phase 4', '03477285990', 'osamam007@gmail.com', NULL, '{\"monday\":\"9:00AM to 11:30PM\",\"tuesday\":\"9:00AM to 11:30PM\",\"wednesday\":\"9:00AM to 11:30PM\",\"thursday\":\"9:00AM to 11:30PM\",\"friday\":\"2:00PM to1:00 AM\",\"saturday\":\"9:00AM to 11:30PM\",\"sunday\":\"Closed\"}', 'Welcome To Our Saloon', '2025-08-21 20:28:02', '2025-08-22 16:02:08');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `urgency` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `appointment_type` enum('walk_in','scheduled','consultation','other') NOT NULL DEFAULT 'other',
  `message` text NOT NULL,
  `status` enum('unread','read','replied') NOT NULL DEFAULT 'unread',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `phone`, `email`, `subject`, `urgency`, `appointment_type`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'sajawal Nazir', '03212328397', 'mn8029038@gmail.com', 'I want to meet you', 'high', 'scheduled', 'Sir I want To Get These Services Urgently', 'replied', '2025-08-22 14:54:52', '2025-08-22 15:08:57');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deals`
--

CREATE TABLE `deals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `original_price` decimal(8,2) NOT NULL,
  `discounted_price` decimal(8,2) DEFAULT NULL,
  `discount_percentage` decimal(5,2) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_popular` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `footer_content`
--

CREATE TABLE `footer_content` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `image_path`, `category`, `title`, `description`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'gallery/1755786341_Spaw.jpg', 'Hair Color', 'Special Cutting', NULL, 1, 2, '2025-08-21 21:25:42', '2025-08-21 21:25:42');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2025_07_30_060842_create_users_table', 1),
(4, '2025_07_30_061100_create_salons_table', 1),
(5, '2025_07_30_061101_create_services_table', 1),
(6, '2025_07_30_061112_create_deals_table', 1),
(7, '2025_07_30_061123_create_appointments_table', 1),
(8, '2025_07_30_061134_create_gallery_table', 1),
(9, '2025_07_30_061156_create_footer_content_table', 1),
(10, '2025_07_30_061220_create_contact_messages_table', 1),
(11, '2025_07_30_130023_create_personal_access_tokens_table', 1),
(12, '2025_08_05_073210_create_barbers_table', 2),
(13, '2025_08_13_100102_add_image_data_to_barbers_table', 3),
(14, '2025_08_07_100000_create_categories_table', 4),
(15, '2025_08_06_000000_create_about_us_table', 5),
(16, '2025_08_07_000000_create_about_us_features_table', 6),
(17, '2025_08_07_000001_create_offers_table', 7),
(18, '2025_08_13_100101_add_image_data_to_services_table', 8),
(19, '2025_08_13_100000_create_customers_table', 9),
(20, '2025_08_13_100100_create_sales_tables', 10);

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `original_price` decimal(8,2) NOT NULL,
  `discounted_price` decimal(8,2) NOT NULL,
  `discount_percentage` int(11) NOT NULL,
  `is_popular` tinyint(1) NOT NULL DEFAULT 0,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `duration` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `title`, `description`, `original_price`, `discounted_price`, `discount_percentage`, `is_popular`, `features`, `duration`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Cutting', 'Come to our saloon and avail this offer', 1000.00, 900.00, 10, 1, '[\"Cutting\",\"Hair Color\"]', '20mint', 3, 1, '2025-08-21 21:36:03', '2025-08-21 21:36:03');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_no` varchar(255) NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `barber` varchar(255) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` varchar(255) NOT NULL DEFAULT 'unpaid',
  `payment_method` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `invoice_no`, `customer_id`, `barber`, `subtotal`, `discount_total`, `tax_total`, `grand_total`, `paid_total`, `balance`, `payment_status`, `payment_method`, `notes`, `created_at`, `updated_at`) VALUES
(7, 'INV-202508-6SEVS', NULL, NULL, 210.00, 0.00, 0.00, 210.00, 200.00, 10.00, 'partial', 'card', NULL, '2025-08-22 15:55:49', '2025-08-22 15:55:49'),
(8, 'INV-202508-O4LWI', NULL, NULL, 60.00, 0.00, 0.00, 60.00, 40.00, 20.00, 'partial', 'cash', NULL, '2025-08-22 17:13:34', '2025-08-22 17:13:34'),
(9, 'INV-202508-WZ0F4', NULL, NULL, 150.00, 0.00, 0.00, 150.00, 0.00, 150.00, 'unpaid', 'cash', NULL, '2025-08-22 17:23:06', '2025-08-22 17:23:06');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sale_id` bigint(20) UNSIGNED NOT NULL,
  `item_type` enum('service','product') NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `name_snapshot` varchar(255) NOT NULL,
  `qty` decimal(10,2) NOT NULL DEFAULT 1.00,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `line_discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `line_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `item_type`, `item_id`, `name_snapshot`, `qty`, `unit_price`, `line_discount`, `tax_amount`, `line_total`, `created_at`, `updated_at`) VALUES
(1, 7, 'service', 1, 'Hair Cutt', 7.00, 30.00, 0.00, 0.00, 210.00, '2025-08-22 15:55:49', '2025-08-22 15:55:49'),
(2, 8, 'service', 1, 'Hair Cutt', 2.00, 30.00, 0.00, 0.00, 60.00, '2025-08-22 17:13:34', '2025-08-22 17:13:34'),
(3, 9, 'service', 1, 'Hair Cutt', 5.00, 30.00, 0.00, 0.00, 150.00, '2025-08-22 17:23:06', '2025-08-22 17:23:06');

-- --------------------------------------------------------

--
-- Table structure for table `sale_payments`
--

CREATE TABLE `sale_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sale_id` bigint(20) UNSIGNED NOT NULL,
  `method` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `reference` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sale_payments`
--

INSERT INTO `sale_payments` (`id`, `sale_id`, `method`, `amount`, `reference`, `created_at`, `updated_at`) VALUES
(1, 7, 'card', 200.00, NULL, '2025-08-22 15:55:49', '2025-08-22 15:55:49'),
(2, 8, 'cash', 40.00, NULL, '2025-08-22 17:13:34', '2025-08-22 17:13:34');

-- --------------------------------------------------------

--
-- Table structure for table `salons`
--

CREATE TABLE `salons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `tag_line` varchar(255) DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone1` varchar(255) DEFAULT NULL,
  `phone2` varchar(255) DEFAULT NULL,
  `email1` varchar(255) DEFAULT NULL,
  `email2` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `social_media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_media`)),
  `hours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hours`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salons`
--

INSERT INTO `salons` (`id`, `name`, `tag_line`, `logo`, `address`, `phone1`, `phone2`, `email1`, `email2`, `description`, `social_media`, `hours`, `created_at`, `updated_at`) VALUES
(1, 'Dubai Saloon', 'Welcome To Our Saloon', 'http://localhost:8000/storage/logos/0SmAMhe5Z7fjeDvwJe7YGlaiTXsQrleJW3e5v5AR.jpg', 'Talwandi Bhindran', '03212328397', '03302366900', 'sajawalali7886@gmail.com', 'osama008@gmail.com', NULL, '{\"facebook\":\"\",\"instagram\":\"\",\"twitter\":\"\"}', '{\"monday\":\"\",\"tuesday\":\"\",\"wednesday\":\"\",\"thursday\":\"\",\"friday\":\"\",\"saturday\":\"\",\"sunday\":\"\"}', '2025-08-22 14:16:59', '2025-08-22 14:41:33');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_data` longtext DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `salon_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `price`, `duration`, `category`, `image`, `image_data`, `is_active`, `salon_id`, `created_at`, `updated_at`) VALUES
(1, 'Hair Cutt', NULL, 30.00, '30mint', 'Cutting', NULL, 'data:image/jpeg;base64,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', 1, 1, '2025-08-22 14:19:12', '2025-08-22 14:19:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'sajawal ali', 'osama007@gmail.com', NULL, '$2y$12$n/SVxPdgy90mC3CswL5nQ.FvLlG7GzMVPaK.462C2mKpzrmlShI0e', NULL, '2025-08-21 20:27:29', '2025-08-21 20:27:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_us`
--
ALTER TABLE `about_us`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `about_us_features`
--
ALTER TABLE `about_us_features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointments_barber_appointment_date_appointment_time_unique` (`barber`,`appointment_date`,`appointment_time`);

--
-- Indexes for table `barbers`
--
ALTER TABLE `barbers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barbers_salon_id_foreign` (`salon_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Indexes for table `contact_information`
--
ALTER TABLE `contact_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deals`
--
ALTER TABLE `deals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `footer_content`
--
ALTER TABLE `footer_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
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
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_items_sale_id_foreign` (`sale_id`);

--
-- Indexes for table `sale_payments`
--
ALTER TABLE `sale_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_payments_sale_id_foreign` (`sale_id`);

--
-- Indexes for table `salons`
--
ALTER TABLE `salons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_salon_id_foreign` (`salon_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_us`
--
ALTER TABLE `about_us`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `about_us_features`
--
ALTER TABLE `about_us_features`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `barbers`
--
ALTER TABLE `barbers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_information`
--
ALTER TABLE `contact_information`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deals`
--
ALTER TABLE `deals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `footer_content`
--
ALTER TABLE `footer_content`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sale_payments`
--
ALTER TABLE `sale_payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `salons`
--
ALTER TABLE `salons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barbers`
--
ALTER TABLE `barbers`
  ADD CONSTRAINT `barbers_salon_id_foreign` FOREIGN KEY (`salon_id`) REFERENCES `salons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_payments`
--
ALTER TABLE `sale_payments`
  ADD CONSTRAINT `sale_payments_sale_id_foreign` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_salon_id_foreign` FOREIGN KEY (`salon_id`) REFERENCES `salons` (`id`) ON DELETE CASCADE;
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
