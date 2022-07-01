-- --------------------------------------------------------
-- Host:                         origami.networkmanager.pl
-- Server version:               10.4.24-MariaDB-cll-lve - MariaDB Server
-- Server OS:                    Linux
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `publications` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Brak tytułu',
  `content` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` date NOT NULL,
  `publishedAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `id_author` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_corrector` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_publisher` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_publications_types` int(11) DEFAULT NULL,
  `id_publications_states` int(11) NOT NULL DEFAULT 0,
  `id_publications_routes` int(11) DEFAULT NULL,
  `isArchived` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `id_publications-states` (`id_publications_states`) USING BTREE,
  KEY `FK_publications_publication_type` (`id_publications_types`) USING BTREE,
  KEY `FK_publications_users` (`id_author`),
  KEY `FK_publications_users_2` (`id_corrector`),
  KEY `FK_publications_users_3` (`id_publisher`),
  KEY `FK_publications_publications_routes` (`id_publications_routes`),
  CONSTRAINT `FK_publications_publications_routes` FOREIGN KEY (`id_publications_routes`) REFERENCES `publications_routes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_publications_publications_states` FOREIGN KEY (`id_publications_states`) REFERENCES `publications_states` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_publications_publications_types` FOREIGN KEY (`id_publications_types`) REFERENCES `publications_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_publications_users` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_publications_users_2` FOREIGN KEY (`id_corrector`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_publications_users_3` FOREIGN KEY (`id_publisher`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `publications` (`id`, `title`, `content`, `createdAt`, `publishedAt`, `updatedAt`, `id_author`, `id_corrector`, `id_publisher`, `id_publications_types`, `id_publications_states`, `id_publications_routes`, `isArchived`) VALUES
	('4a7e920b-0791-4e15-9be7-82a5fcba3f6b', 'Zielone Oczy', '{"blocks":[{"key":"cktrh","text":"Dzień dobry,","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7ugh4","text":"Nazywam się Cezary Baryka i od 20 minut jestem właścicielem tego oto szklanego domu.","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":12,"length":13,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"e3tq","text":"Zgadza się.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', '2022-06-15', NULL, '2022-06-18', '301428a8-2b4b-4977-a69e-c772059829bb', 'b2a1c1b7-9ee4-4324-877b-dffef927a6a9', NULL, NULL, 0, NULL, 0),
	('c3f79715-d93b-4305-bd23-4fcf5b4526d9', 'Super Fajna Recenzja', '{"blocks":[{"key":"lqpk","text":"The standard Lorem Ipsum passage, used since the 1500s","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":0,"length":54,"style":"STRIKETHROUGH"}],"entityRanges":[],"data":{}},{"key":"8ocvg","text":"\\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\\"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2fg6p","text":"Section 1.10.32 of \\"de Finibus Bonorum et Malorum\\", written by Cicero in 45 BC","type":"header-three","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"40fib","text":"\\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\\"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4fkdk","text":"1914 translation by H. Rackham","type":"header-three","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1sulk","text":"\\"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?\\"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"e9l0f","text":"Section 1.10.33 of \\"de Finibus Bonorum et Malorum\\", written by Cicero in 45 BC","type":"header-three","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', '2022-06-04', '2022-06-07', '2022-06-04', '8ae09cec-b23d-4f59-b21f-e543b63ed5f4', '301428a8-2b4b-4977-a69e-c772059829bb', '301428a8-2b4b-4977-a69e-c772059829bb', 0, 4, 0, 0),
	('f1631374-d9f5-44f3-9843-873fc477fd4e', 'Bardzo ciekawy tytuł', '{"blocks":[{"key":"7227i","text":"Gdzieś tam daleko w odległej galaktyce...","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4nci","text":"Exercitation ullnim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":59,"length":140,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"8q52c","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":31,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"d3ti1","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"f84oj","text":"42 pierogi ~ Paulo Coelho","type":"blockquote","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"a94j8","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4mfrs","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":118,"length":131,"style":"ITALIC"},{"offset":118,"length":131,"style":"UNDERLINE"}],"entityRanges":[],"data":{}},{"key":"35fif","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":31,"style":"ITALIC"},{"offset":0,"length":31,"style":"UNDERLINE"}],"entityRanges":[],"data":{}},{"key":"eeltl","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad miim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irdure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":158,"style":"ITALIC"},{"offset":0,"length":77,"style":"UNDERLINE"},{"offset":21,"length":105,"style":"BOLD"},{"offset":158,"length":91,"style":"STRIKETHROUGH"}],"entityRanges":[],"data":{}},{"key":"b3n26","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":31,"style":"STRIKETHROUGH"}],"entityRanges":[],"data":{}},{"key":"afgar","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":51,"style":"STRIKETHROUGH"}],"entityRanges":[],"data":{}},{"key":"cjl9b","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ammk5","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3knt6","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"42la9","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"dn7s1","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fmo18","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7g8ti","text":"fugiat nulla pariatur. Excepteu","type":"unordered-list-item","depth":2,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"es23o","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2c9tn","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6uk31","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"a8191","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7602t","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8645q","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5snn1","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7b4db","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c98pn","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"29d8t","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"22bvl","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"du6rp","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ef556","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia nim ad minim veniam, quis nostrud exercitation ullamco laboris nis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"de51f","text":"fugiat nulla pariatur. Excepteu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bj9sb","text":"r sint occaecat cupidatat non pro","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"v8vq","text":"r sint occaecat cupidatat non proident, sunt in culpa qui officia amco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolculpa qui officia amco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bi9qi","text":"fugiat nulla pariatur. Eor in reprehenderit in voluptate velit esse cillum dolore eu","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9s614","text":"fugiat nulla pariatur. Exce","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"f1pa4","text":"r sint occaecat cupidatat non proident, sunt in culpa qui offici","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8vagb","text":"deserunt mollit anim id est laborum. Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"1o54k","text":"reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}', '2022-03-16', NULL, '2022-06-19', '301428a8-2b4b-4977-a69e-c772059829bb', '301428a8-2b4b-4977-a69e-c772059829bb', NULL, NULL, 3, NULL, 0);

CREATE TABLE IF NOT EXISTS `publications_comments` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_publication` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_publications_comments_publications` (`id_publication`),
  KEY `FK_publications_comments_users` (`id_user`),
  CONSTRAINT `FK_publications_comments_publications` FOREIGN KEY (`id_publication`) REFERENCES `publications` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_publications_comments_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `publications_comments` (`id`, `id_user`, `id_publication`, `comment`, `createdAt`) VALUES
	('07094c0e-092f-4b3b-baaa-48327f229255', '301428a8-2b4b-4977-a69e-c772059829bb', 'f1631374-d9f5-44f3-9843-873fc477fd4e', 'Test Test', '2022-06-19'),
	('18291e78-5f9c-4c7a-8361-fa26455b8df0', '301428a8-2b4b-4977-a69e-c772059829bb', 'f1631374-d9f5-44f3-9843-873fc477fd4e', 'Nie rozumiem tego języka...', '2022-05-23'),
	('de965085-c186-4e96-a259-532fecdc4a62', '301428a8-2b4b-4977-a69e-c772059829bb', 'c3f79715-d93b-4305-bd23-4fcf5b4526d9', 'Świetna recenzja, tak trzymać.', '2022-06-04');

CREATE TABLE IF NOT EXISTS `publications_routes` (
  `id` int(11) NOT NULL DEFAULT 0,
  `route` varchar(75) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `publications_routes` (`id`, `route`, `message`) VALUES
	(0, 'example1', 'Podstrona 1'),
	(1, 'example2', 'Podstrona 2'),
	(2, 'example3', 'Podstrona 3');

CREATE TABLE IF NOT EXISTS `publications_states` (
  `id` int(11) NOT NULL DEFAULT 0,
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `publications_states` (`id`, `status`) VALUES
	(0, 'wersja robocza'),
	(1, 'do korekty'),
	(2, 'w trakcie korekty'),
	(3, 'do publikacji'),
	(4, 'opublikowano'),
	(5, 'zarchiwizowano');

CREATE TABLE IF NOT EXISTS `publications_types` (
  `id` int(11) NOT NULL DEFAULT 0,
  `type` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_pl` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `publications_types` (`id`, `type`, `type_pl`) VALUES
	(0, 'review', 'recenzja'),
	(1, 'article', 'artykuł'),
	(2, 'column', 'felieton');

CREATE TABLE IF NOT EXISTS `roles` (
  `id` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_pl` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `role`, `role_pl`) VALUES
	('0', 'reviewer', 'Recenzent'),
	('1', 'editor', 'Redaktor'),
	('2', 'specialist', 'Specjalista'),
	('3', 'corrector', 'Korektor'),
	('4', 'moderator', 'Moderator'),
	('8', 'admin', 'Administrator'),
	('9', 'headadmin', 'Główny Administrator');

CREATE TABLE IF NOT EXISTS `terms` (
  `id` int(11) NOT NULL,
  `text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `terms` (`id`, `text`, `link`, `name`) VALUES
	(1, 'Zatwierdź, jeżeli zgadzasz się z regulaminem i nie lubisz sernika z rodzynkami.', 'https://http.cat/501', 'Regulamin');

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nick` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` date NOT NULL,
  `firstName` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secondName` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_role` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `isTermsAccepted` tinyint(4) NOT NULL DEFAULT 0,
  `province` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `city` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `phoneNumber` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `inpost` char(6) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `dateOfBirth` date NOT NULL,
  `hash` char(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `salt` char(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nick` (`nick`),
  KEY `FK_users_roles` (`id_role`),
  CONSTRAINT `FK_users_roles` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `email`, `nick`, `createdAt`, `firstName`, `secondName`, `id_role`, `title`, `isActive`, `isTermsAccepted`, `province`, `city`, `phoneNumber`, `inpost`, `dateOfBirth`, `hash`, `salt`) VALUES
	('301428a8-2b4b-4977-a69e-c772059829bb', 'megaadmin@gmail.com', 'GigaMochi', '2022-02-04', 'Jan', 'Dzban', '9', 'Admin Subaru', 1, 1, 'Isekai', 'Isengard', '112112112', 'JAP009', '1969-05-23', 'c9507647d45ae826324896092f64826bbfb63dfa011a49b5906ee4723f7b04c1bb0bed2df61a0f62003a433b7d5626caf7ef240004b68834b0341a2576d09d13', 'd2fc7efe2a5d937833142e87c22d3e182203936fb06a33d618488dec94492708'),
	('5ae6df27-d824-4132-b149-0414cfb93fef', 'ehctcmhwxphlhftdos@kvhrw.com', 'AdminUser', '2022-06-16', 'Admin', 'User', '8', 'Głównodowodzący', 1, 0, '', '', '', '', '1998-06-20', 'b4b1672647941994623ccca81341f6ba1763191b26a803b5fbeff5bfa64206ce745acd1841294ee07f92713a761450519a8e4a5fb4d348ecc607b5ef05a58167', '948b045c002a31da77419851783c7900f3ba35896be9479c696cb648470fc65b'),
	('8ae09cec-b23d-4f59-b21f-e543b63ed5f4', 'xenomorft@gmail.com', 'Xeno', '2022-02-17', 'Xeno', 'Morf', '0', 'Srebrny Recenzent', 1, 1, 'ChongChong', 'Rivia', '', '', '1999-10-11', 'db1b0aefdae7effd7d2d406d65964007ebde9317d9cdf10bcd4f9f4ced6f99eb011d0a651f39e01b2ce4c5ec95e52543409fbbebce631451ac586666f3683b7a', '8db8606ab66a306bca98a4439065586ba003867a5965fb61f8c1be29beac3993'),
	('9542142f-f6e8-4a65-b4fd-14fc0714b5af', 'superbogini@gmail.com', 'Aqua', '2022-02-17', 'Aqua', 'God', '3', 'Useless', 1, 1, 'Woda', 'Żaba', '477213657', '', '1950-10-11', '5d1281844fc21005b88679ad5228c195c5fcd07f7da8fa4fc3f996c24fb64f6933b36f66765fda057005bd84fe62b0a947253c962fd49c527b4b66e353c40385', '2ecd6a336e0eb0f61a90a2827519a362ee81e70ee7cdaefd89340f3bd99eb5d2'),
	('b2a1c1b7-9ee4-4324-877b-dffef927a6a9', 'ela.kocur@gmail.com', 'Ela03', '2022-02-17', 'Elżbieta', 'Kocur', '4', 'Batwoman', 1, 1, '', '', '', '', '1988-10-11', '17d1901c23d23f3eae0384bf8d1b4379cf30fbc0c25875ab6ffb3d9f1888c3df0fcb12914b74701993c6bdc7de931fcdf9d918344054aefba4868d4228cf21c2', 'e07fc36fcd1797105df6c7d423eeda48eff26afb7c865d1f0a30723a4cddbff3'),
	('badf5aa3-03e8-4f6f-bf50-2a6ea40142f0', 'nyq27551@xcoxc.com', 'Hurberto', '2022-05-23', 'Norbert', 'Kujafon', '2', 'Recenzent v3', 0, 0, '', '', '', '', '2001-10-25', '93ba9fff0beed97f268a9056ea2a0844bac60bf37c4ab68605a8c268512ffac1243bd18ee1cdf13f964a834a290777008d55e85da4bef1106c3c03516a624239', '53338f6ab63fab8e54f966c4e7206ac0bc4ba0444a44269190d0732799d45d7b'),
	('c7e5bcca-8525-436a-a578-93edf2c9e539', 'spongebobe@gmail.com', 'Doktorek', '2022-02-11', 'Patruck', 'Apple', '8', 'Hamburger', 1, 1, '', '', '910443223', '', '2009-05-01', 'd7c23f1a8adf597186a611aeef189b2056385affe67ad52845b33668da3d3e378afa814dcc7818d6d7f4ec2f1106884c24219ef99b06b390fbd6da3eb2794b8e', 'a640adc8b7a5dae32dafbb8a83b2c2e42fc6792c38d0d83bea6a75b61e03e689'),
	('cfecc2c5-a125-4a6d-8b53-62b8dd71a890', 'dasdasas@gmail.com', 'MackiMacki99', '2022-02-17', 'Koro', 'Sensei', '3', 'Saitama', 1, 0, '', '', '', '', '1967-10-11', '820657fa8039b0069e1b598c13f1f414adc6067680511fe8d6d25041aa42cf0816228b10c4c1a620d476f9274da604fa9aa952cb142c17199fd02d948a64771d', '07b942fd1da62f71c79a4e1ff5b7103537aa6ce1ab1caf1bc34b0cad4a923fb4'),
	('dcee0959-ebdf-4739-ba6e-7aeaebed109f', 'pan@gmail.com', 'PanPan', '2022-02-11', 'Devil', 'MożePłakać', '0', 'Zielony Smar', 1, 1, 'Madagaskar', '', '', '', '2009-10-11', '6bd4af7852782dc157a6a94b43d7342c0ffb3a97d0adf9a3c720d6552b4e5eb671d1cc26cf8f6847128894da1f1c50f8636762f866191d3075bbd1002007cea6', '93b141bf9bc328cccd5e52c7767fa38dbc100f25be9ed0d26a8fc9999b97e3aa'),
	('e337068c-c6d0-4ec6-b581-63fea32e26a6', 'yasuoxdxd@wp.pl', 'Morgana', '2022-03-27', 'Joker', 'Nijaki', '3', 'Areczek', 1, 0, '', 'Damaszek', '', '', '1993-04-14', '9014870e62839e21ad4b295cd6fbaad1629b47c127c63312d127b7983462f29db1c9162737e828749051526f92945bf0ba7b5704e8af2e8abe679e3aa2f49549', 'dec6d4ec243fc8dc35fa0a7822c5f004fac176b94e9c3edbc5a8f299e9d18f10'),
	('e59fc0f3-5dbe-4376-b881-b6d59fba4fad', 'leviosaaa@gmail.com', 'RoxyMyLove', '2022-02-17', 'Rudeus', 'Garfield', '8', 'Magiczne Zioła', 1, 1, '', '', '', '', '2003-10-11', 'e22975836849c74974b090cc1100d3e95b7d9dc000fd844dcb02238ce3cd0bfcc4ef3d6a29aaf475b6fc65f787374a664e064a59f4cba66532367e77a593dda7', '8d45b1987e9aa9a519c0f7711702fe35d4c94ed7925bf99f5a21f7efdc986fd5'),
	('ef5ffbe7-3f0a-4ed8-b795-0369a8d74ede', 'power@gmail.com', 'Tracz', '2021-02-01', 'Kalisza', 'Czarny', '0', 'Chad', 1, 0, '', 'Wólka', '', 'APS312', '2000-05-23', '0fe7d6ba5c2568324e5e2f6c39f91349af425b2f22e27cf5ec9094d78ba90770f78a78af9c65141263ad9de8a27fb176d200b57a6e8842a08bd2777e7eb7b463', 'e1d5d5bf9154815406f6661f27f9735c55aec082db1dea4b75e6ffa7b21ebd04'),
	('f78659a6-11c4-49bb-988c-a8b45b99d0d5', 'jan.kowalski@gmail.com', 'JanKowalski', '2022-02-17', 'Jan', 'Kowalski', '4', 'Polak', 1, 0, 'Pcim', 'Pcimowo', '948554223', '', '2013-10-11', 'e962c9b597ca352ce58da7276caaddbee40c53e4732b252c38251827afe3f5a072a53d381704e1405bc186dd525b9a2dab44f2b46abe3e1a7029088038451af5', '6c1de30ef5a0fa0f41519b52d012c619a6eb627a7a33c14f05257df079df0c30');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
