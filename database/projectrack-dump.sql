CREATE DATABASE  IF NOT EXISTS `projectrack` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `projectrack`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: projectrack
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@SQL_NOTES, SQL_NOTES=0 */;

-- USER TABELLE

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL DEFAULT '0',
  `surname` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL DEFAULT '',
  `nickname` varchar(100) NOT NULL DEFAULT '',
  `google_id` varchar(100) NOT NUll Default '',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
(1,'Brahner','Laurenz','laurenz123',"laurenzmail.de"),
(2,'Fröhlich','Peter','Peteristlustig',"PeterLustiggmail.com"),
(3,'Lipa','Dua','Duasing',"duazmail.de"),
(4,'Tute','Iris','Iristest',"irisggmail.com"),
(5,'Bohn','Sara','Sara2003',"saramail.de"),
(6,'geri','Anna','Annal',"annagmail.com");

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members` (
  `user_id` int(11) NOT NULL DEFAULT '0',
  `project_id` int(11) NOT NULL DEFAULT '0',
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) on delete cascade, 
  FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES
('1','1'),
('2','1'),
('3','1'),
('4','2'),
('5','2'),
('7','1'),
('7','2'),
('6','2');

/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(110) NOT NULL DEFAULT '',
  `description` varchar(110) NOT NULL DEFAULT '',
  `founder` varchar(110) NOT NULL DEFAULT '',
  `startdate` DATETIME(6) NOT NULL DEFAULT '1970-01-01 00:00:00',
  `enddate` DATETIME(6) NOT NULL DEFAULT '1970-01-01 00:00:00',
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES
(1,"Sopra",'Testprojekt','1',"2023-12-10 16:00:00", "2024-06-10 12:00:00"),
(2,"Fahrradgruppe",'Testprojekt2','1',"2023-12-10 16:00:00", "2024-06-10 12:00:00"),
(3,"Forster",'Testprojekt3','2',"2023-12-10 16:00:00", "2024-06-10 12:00:00"),
(4,"Data Science",'Testprojekt1','3',"2023-12-10 16:00:00", "2024-06-10 12:00:00"),
(5,"Freidrichsen",'Testprojekt2','4',"2023-12-10 16:00:00", "2024-06-10 12:00:00"),
(6,"Test",'Testprojekt3','4',"2023-12-10 16:00:00", "2024-06-10 12:00:00");

/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `phases`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phases` (
  `phases_id` int(11) NOT NULL AUTO_INCREMENT ,
  `phasename` varchar(110) NOT NULL DEFAULT '',
  `indx` varchar(110) NOT NULL DEFAULT '',
  `project_id` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`phases_id`),
  FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `phases` WRITE;
/*!40000 ALTER TABLE `phases` DISABLE KEYS */;
INSERT INTO `phases` VALUES
(1,'To Do','1','1'),
(2,'In Ptogress','2','1'),
(3,'Done','4','1'),
(4,'R4R','3','1'),
(5,'Brainstorming','2','2'),
(6,'todo','2','2');

/*!40000 ALTER TABLE `phases` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT ,
  `tasktitle` varchar(110) NOT NULL DEFAULT '',
  `description` varchar(110) NOT NULL DEFAULT '',
  `duedate` DATETIME(6) NOT NULL DEFAULT '1970-01-01 00:00:00',
  `user_id` int(11) NOT NULL DEFAULT  '0',
  `phases_id` int(11) NOT NULL DEFAULT  '0',
  PRIMARY KEY (`task_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) on delete cascade,
  FOREIGN KEY (`phases_id`) REFERENCES `phases` (`phases_id`) on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES
(1,'Firebase','To Do', "2024-06-10 12:00:00",'1','1'),
(2,'authcontext','In Ptogress', "2024-06-10 12:00:00",'2','3'),
(3,'login','beschreibung', "2024-06-10 12:00:00",'3','2'),
(4,'createprofil','beschreibung', "2024-06-10 12:00:00",'3','1'),
(5,'home','beschreibung', "2024-06-10 12:00:00",'1','2'),
(6,'test1','beschreibung', "2024-06-10 12:00:00",'2','1'),
(7,'test3','To Do', "2024-06-10 12:00:00",'1','1'),
(8,'tes2','In Ptogress', "2024-06-10 12:00:00",'2','3'),
(9,'tese2','beschreibung', "2024-06-10 12:00:00",'3','2'),
(10,'createprofil','beschreibung', "2024-06-10 12:00:00",'3','1'),
(11,'home','beschreibung', "2024-06-10 12:00:00",'1','2'),
(12,'about','beschreibung', "2024-06-10 12:00:00",'1','1'),
(13,'Firebase','To Do', "2024-06-10 12:00:00",'1','1'),
(14,'authcontext','In Ptogress', "2024-06-10 12:00:00",'2','3'),
(15,'login','beschreibung', "2024-06-10 12:00:00",'3','2'),
(16,'createprofil','beschreibung', "2024-06-10 12:00:00",'3','3'),
(17,'home','beschreibung', "2024-06-10 12:00:00",'2','4'),
(18,'test1','beschreibung', "2024-06-10 12:00:00",'2','4'),
(19,'test3','To Do', "2024-06-10 12:00:00",'1','1'),
(20,'tes2','In Ptogress', "2024-06-10 12:00:00",'2','4'),
(21,'tese2','beschreibung', "2024-06-10 12:00:00",'2','3'),
(22,'createprofil','beschreibung', "2024-06-10 12:00:00",'2','4'),
(23,'home','beschreibung', "2024-06-10 12:00:00",'1','3'),
(24,'about','beschreibung', "2024-06-10 12:00:00",'1','3');

/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT ,
  `comment` varchar(110) NOT NULL DEFAULT '',
  `creationdate` DATETIME(6) NOT NULL DEFAULT '1970-01-01 00:00:00',
  `user_id` int(11) NOT NULL DEFAULT  '0',
  `task_id` int(11) NOT NULL DEFAULT  '0',
  PRIMARY KEY (`comment_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) on delete cascade,
  FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES
(1,'ich mag kuchen', "2024-06-10 12:00:00",'1','1'),
(2,'ich mag kuchen', "2024-06-10 13:00:00",'2','3'),
(3,'ich mag kuchen', "2024-08-10 11:00:00",'3','2'),
(4,'ich mag kuchen', "2024-06-10 10:00:00",'3','1'),
(5,'ich mag kuchen', "2024-06-10 14:00:00",'1','2'),
(6,'ich mag kuchen', "2024-03-10 15:00:00",'2','1'),
(7,'ich', "2024-06-10 02:00:00",'7','1'),
(8,'ich mag kuchen', "2024-06-10 12:00:00",'2','1'),
(9,'ich', "2024-07-10 12:00:00",'7','1');


/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;