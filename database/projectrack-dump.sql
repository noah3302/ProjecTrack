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


DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members` (
  `user_id` int(11) NOT NULL DEFAULT '0',
  `project_id` int(11) NOT NULL DEFAULT '0',
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) on delete cascade, 
  FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(110) NOT NULL DEFAULT '',
  `description` varchar(110) NOT NULL DEFAULT '',
  `founder` int(11) NOT NULL DEFAULT '0',
  `manager` int(11) NOT NULL DEFAULT '0',
  `startdate` DATETIME(6) NOT NULL DEFAULT '1970-01-01 00:00:00',
  `enddate` DATETIME(6) NOT NULL DEFAULT '1970-01-01 00:00:00',
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `phases`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phases` (
  `phases_id` int(11) NOT NULL AUTO_INCREMENT ,
  `phasename` varchar(110) NOT NULL DEFAULT '',
  `ranking` int(11) NOT NULL DEFAULT 0,
  `project_id` int(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`phases_id`),
  FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) on delete cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT ,
  `tasktitle` varchar(110) NOT NULL DEFAULT '',
  `description` varchar(110) NOT NULL DEFAULT '',
  `score` varchar(110) NOT NULL DEFAULT '',
  `duedate` DATETIME(6) NOT NULL DEFAULT '1970-01-01 00:00:00',
  `user_id` int(11) NOT NULL DEFAULT  '0',
  `phases_id` int(11) NOT NULL DEFAULT  '0',
  `creator_id` int(11) NOT NULL DEFAULT  '0',
  PRIMARY KEY (`task_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) on delete cascade,
  FOREIGN KEY (`phases_id`) REFERENCES `phases` (`phases_id`) on delete cascade,
  FOREIGN KEY (`creator_id`) REFERENCES `user` (`user_id`) on delete cascade

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
