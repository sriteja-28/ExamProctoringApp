-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: exam_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `optionA` varchar(255) NOT NULL,
  `optionB` varchar(255) NOT NULL,
  `optionC` varchar(255) NOT NULL,
  `optionD` varchar(255) NOT NULL,
  `correctOption` varchar(255) NOT NULL,
  `categoryId` int NOT NULL,
  `examId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `questions_category_id_text` (`categoryId`,`text`),
  KEY `examId` (`examId`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`examId`) REFERENCES `exams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1282 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1252,'What does HTML stand for?','Hyperlinks and Text Markup Language','Hyper Text Markup Language','Home Tool Markup Language','Hyperlink Text Management Language','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1253,'Which tag is used to create a paragraph in HTML?','<para>','<p>','<paragraph>','<text>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1254,'How do you create a line break in HTML?','<break>','<br>','<lb>','<newline>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1255,'Which tag is used to create a hyperlink in HTML?','<a>','<link>','<href>','<url>','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1256,'How do you insert an image in HTML?','<img src=\"image.jpg\">','<image src=\"image.jpg\">','<img>image.jpg</img>','<pic src=\"image.jpg\">','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1257,'Which HTML element is used to define a list item?','<ul>','<ol>','<li>','<list>','C',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1258,'What is the correct way to add a comment in HTML?','// This is a comment','<!-- This is a comment -->','/* This is a comment */','** This is a comment **','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1259,'Which tag is used to define a table row?','<td>','<tr>','<th>','<table>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1260,'What does the <title> tag do in HTML?','Sets the title of the document displayed in the browser tab','Displays a heading on the page','Changes the font size of the document','Creates a pop-up message','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1261,'What is the default alignment of text in an HTML paragraph?','Left','Center','Right','Justified','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1262,'Which tag is used to group block elements in HTML?','<span>','<div>','<section>','<group>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1263,'What is the correct HTML tag for making a checkbox?','<check>','<checkbox>','<input type=\"checkbox\">','<input type=\"check\">','C',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1264,'Which attribute is used to define inline CSS styles in HTML?','style','css','format','design','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1265,'Which HTML element defines a navigation menu?','<menu>','<nav>','<ul>','<section>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1266,'Which tag is used to define a footer for a document or section?','<bottom>','<footer>','<end>','<section>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1267,'Which HTML element is used to display a scalar measurement within a range?','<progress>','<meter>','<range>','<scale>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1268,'What does the <thead> tag do in a table?','Defines the footer of the table','Groups the header content in a table','Adds a border to the table','Creates a new column','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1269,'Which attribute is used to specify a unique ID for an HTML element?','class','id','name','unique','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1270,'What is the purpose of the <abbr> tag in HTML?','To define an acronym or abbreviation','To bold the text','To highlight a section','To create a clickable link','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1271,'Which tag is used to embed an audio file in HTML?','<mp3>','<audio>','<sound>','<media>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1272,'Which of the following HTML5 elements is used for rendering graphics?','<svg>','<canvas>','<draw>','<graphics>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1273,'Which attribute of the <form> tag specifies where to send the form data?','method','action','submit','target','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1274,'What is the purpose of the data-* attribute in HTML5?','To store custom data for JavaScript','To define an inline JavaScript function','To create animations','To style elements','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1275,'Which HTML5 element is used to display content in a flexible grid layout?','<table>','<grid>','<flexbox>','<div> (Used with CSS Flexbox)','D',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1276,'Which of the following is NOT a valid HTML5 tag?','<article>','<dialog>','<blink>','<section>','C',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1277,'What is the default character encoding for HTML5?','ASCII','ISO-8859-1','UTF-8','Unicode','C',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1278,'What does the sandbox attribute in <iframe> do?','Prevents the iframe from executing scripts','Disables iframe content','Increases iframe size','Hides iframe content','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1279,'Which API allows storing data in a user’s browser persistently?','Web Storage API','Session API','WebSocket API','Cache API','A',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1280,'Which HTML5 tag is used to define an interactive widget for opening/closing content?','<widget>','<details>','<content>','<info>','B',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55'),(1281,'Which tag is used to define custom elements in HTML5?','<custom>','<component>','<element>','<template>','D',825,NULL,'2025-05-10 05:32:55','2025-05-10 05:32:55');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-14  9:53:32
