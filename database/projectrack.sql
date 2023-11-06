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

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL DEFAULT '0',
  `nachname` varchar(100) NOT NULL DEFAULT '',
  `vorname` varchar(100) NOT NULL DEFAULT '',
  `nickname` varchar(100) NOT NULL DEFAULT '',
  `google_id` varchar(100) NOT NUll Default '',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Brahner','Laurenz','laurenz123',"laurenzmail.de"),
(2,'Fröhlich','Peter','Peteristlustig',"PeterLustiggmail.com"),
(3,'Lipa','Dua','Duasing',"duazmail.de"),
(4,'Tute','Iris','Iristest',"irisggmail.com"),
(5,'Bohn','Sara','Sara2003',"saramail.de"),
(6,'geri','Anna','Annal',"annagmail.com");

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `mitglieder`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mitglieder` (
  `boId` int(11) NOT NULL DEFAULT '0',
  `role` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `project_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`boId`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) on delete cascade, 
  FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `mitglieder` WRITE;
/*!40000 ALTER TABLE `mitglieder` DISABLE KEYS */;
INSERT INTO `mitglieder` VALUES
(1,1,'1','laurenz123'),
(2,1,'2','Peteristlustig'),
(3,1,'3','Duasing'),
(4,2,'1','Iristest'),
(5,2,'2','Sara2003'),
(6,2,'3','Annal');

/*!40000 ALTER TABLE `mitglieder` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `titel` varchar(110) NOT NULL DEFAULT '',
  `discribtion` varchar(110) NOT NULL DEFAULT '',
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

DROP TABLE IF EXISTS `phasen`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phasen` (
  `phasen_id` int(11) NOT NULL AUTO_INCREMENT ,
  `phasenname` varchar(110) NOT NULL DEFAULT '',
  `index` int(11) NOT NULL DEFAULT '0',
  `project_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`phasen_id`),
  FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `phasen` WRITE;
/*!40000 ALTER TABLE `phasen` DISABLE KEYS */;
INSERT INTO `phasen` VALUES
(1,1,'To Do','1'),
(2,2,'In Ptogress','2'),
(3,3,'Done','3'),
(4,4,'R4R','3'),
(5,5,'Brainstorming','1'),
(6,6,'todo','2');

/*!40000 ALTER TABLE `phasen` ENABLE KEYS */;
UNLOCK TABLES;