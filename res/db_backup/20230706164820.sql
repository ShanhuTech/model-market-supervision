-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: model-market-supervision
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `model-market-supervision`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `model-market-supervision` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `model-market-supervision`;

--
-- Table structure for table `mms_camera`
--

DROP TABLE IF EXISTS `mms_camera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_camera` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '代码',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地址',
  `protocol_type` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '协议类型',
  `connect_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '连接类型',
  `lng` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '经度',
  `lat` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '纬度',
  `platform_extend_parameter` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '平台扩展参数',
  `last_capture_data` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后抓拍数据',
  `last_capture_timestamp` bigint unsigned DEFAULT NULL COMMENT '最后抓拍时间戳',
  `last_capture_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后抓拍时间',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`code`,`description`,`url`,`protocol_type`,`connect_type`,`last_capture_timestamp`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_摄像头';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_camera`
--

LOCK TABLES `mms_camera` WRITE;
/*!40000 ALTER TABLE `mms_camera` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_camera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_engine-capture`
--

DROP TABLE IF EXISTS `mms_engine-capture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_engine-capture` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `url` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地址',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `process_number` int unsigned NOT NULL COMMENT '进程数',
  `version` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '版本',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`name`,`create_timestamp`,`remove_timestamp`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_抓拍引擎';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_engine-capture`
--

LOCK TABLES `mms_engine-capture` WRITE;
/*!40000 ALTER TABLE `mms_engine-capture` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_engine-capture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_engine-vision`
--

DROP TABLE IF EXISTS `mms_engine-vision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_engine-vision` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `capture_uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '抓拍引擎的uuid',
  `url` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地址',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `version` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '版本',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`name`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_识别引擎';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_engine-vision`
--

LOCK TABLES `mms_engine-vision` WRITE;
/*!40000 ALTER TABLE `mms_engine-vision` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_engine-vision` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_event-record`
--

DROP TABLE IF EXISTS `mms_event-record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_event-record` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `alarm_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '警告的id（事件回调的id）',
  `location_uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地点的uuid',
  `event_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '事件的id',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`alarm_id`,`location_uuid`,`event_id`,`create_timestamp`,`remove_timestamp`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_事件记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_event-record`
--

LOCK TABLES `mms_event-record` WRITE;
/*!40000 ALTER TABLE `mms_event-record` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_event-record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_event-record-camera`
--

DROP TABLE IF EXISTS `mms_event-record-camera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_event-record-camera` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `record_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '记录的uuid',
  `camera_uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '摄像头的uuid',
  `capture_data` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '抓拍数据',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`record_uuid`,`camera_uuid`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_事件记录-摄像头';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_event-record-camera`
--

LOCK TABLES `mms_event-record-camera` WRITE;
/*!40000 ALTER TABLE `mms_event-record-camera` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_event-record-camera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_global-config`
--

DROP TABLE IF EXISTS `mms_global-config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_global-config` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `mms_server_ip` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '模型超市后台ip',
  `mms_server_port` int unsigned NOT NULL COMMENT '模型超市后台端口',
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_全局配置';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_global-config`
--

LOCK TABLES `mms_global-config` WRITE;
/*!40000 ALTER TABLE `mms_global-config` DISABLE KEYS */;
INSERT INTO `mms_global-config` VALUES ('b150c5428ba646b89dc1c1656959edf1','192.168.10.14',9110);
/*!40000 ALTER TABLE `mms_global-config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_location`
--

DROP TABLE IF EXISTS `mms_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_location` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `type_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型的uuid',
  `capture_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '抓拍引擎的uuid',
  `code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '代码',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '状态',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`type_uuid`,`capture_uuid`,`code`,`name`,`status`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_地点';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_location`
--

LOCK TABLES `mms_location` WRITE;
/*!40000 ALTER TABLE `mms_location` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_location-camera`
--

DROP TABLE IF EXISTS `mms_location-camera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_location-camera` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `location_uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地点的uuid',
  `camera_uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '摄像头的uuid',
  `vision_area` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '识别区域',
  `vision_line` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '识别线段',
  `is_mark` char(1) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '是否标注',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`location_uuid`,`camera_uuid`,`is_mark`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_地点摄像头';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_location-camera`
--

LOCK TABLES `mms_location-camera` WRITE;
/*!40000 ALTER TABLE `mms_location-camera` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_location-camera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_location-model`
--

DROP TABLE IF EXISTS `mms_location-model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_location-model` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `location_uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地点的uuid',
  `model_uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '模型的uuid',
  `tolerance_time` int unsigned NOT NULL COMMENT '容忍时间',
  `merge_time` int unsigned NOT NULL COMMENT '合并时间',
  `threshold` int unsigned NOT NULL COMMENT '阈值',
  `confidence` int unsigned NOT NULL COMMENT '置信度',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`location_uuid`,`model_uuid`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_地点模型';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_location-model`
--

LOCK TABLES `mms_location-model` WRITE;
/*!40000 ALTER TABLE `mms_location-model` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_location-model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_location-type`
--

DROP TABLE IF EXISTS `mms_location-type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_location-type` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `order` int unsigned NOT NULL COMMENT '排序编号',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`name`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_地点类型';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_location-type`
--

LOCK TABLES `mms_location-type` WRITE;
/*!40000 ALTER TABLE `mms_location-type` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_location-type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_model`
--

DROP TABLE IF EXISTS `mms_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_model` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `type_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型的uuid',
  `event_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '事件的id',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `text` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文本',
  `description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `tolerance_time` int unsigned NOT NULL COMMENT '容忍时间',
  `merge_time` int unsigned NOT NULL COMMENT '合并时间',
  `threshold` int unsigned NOT NULL COMMENT '阈值',
  `confidence` int unsigned NOT NULL COMMENT '置信度',
  `order` int unsigned NOT NULL COMMENT '排序编号',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '状态',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`type_uuid`,`event_id`,`order`,`status`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_模型';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_model`
--

LOCK TABLES `mms_model` WRITE;
/*!40000 ALTER TABLE `mms_model` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_model-attach`
--

DROP TABLE IF EXISTS `mms_model-attach`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_model-attach` (
  `uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `model_uuid` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '模型的uuid',
  `title` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `data` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '数据',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`model_uuid`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_模型附件';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_model-attach`
--

LOCK TABLES `mms_model-attach` WRITE;
/*!40000 ALTER TABLE `mms_model-attach` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_model-attach` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mms_model-type`
--

DROP TABLE IF EXISTS `mms_model-type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mms_model-type` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `order` int unsigned NOT NULL COMMENT '排序编号',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`name`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模型超市_模型类型';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mms_model-type`
--

LOCK TABLES `mms_model-type` WRITE;
/*!40000 ALTER TABLE `mms_model-type` DISABLE KEYS */;
/*!40000 ALTER TABLE `mms_model-type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_admin`
--

DROP TABLE IF EXISTS `security_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_admin` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `org_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '组织架构的uuid',
  `role_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色的uuid',
  `name` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账户名称',
  `password` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `failed_retry_count` tinyint unsigned NOT NULL COMMENT '失败重复计数',
  `login_token` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登陆令牌',
  `frozen_timestamp` bigint unsigned DEFAULT NULL COMMENT '冻结时间戳',
  `frozen_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '冻结时间',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '状态',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`org_uuid`,`role_uuid`,`name`,`password`,`status`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='安全_管理员';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_admin`
--

LOCK TABLES `security_admin` WRITE;
/*!40000 ALTER TABLE `security_admin` DISABLE KEYS */;
INSERT INTO `security_admin` VALUES ('1315d2b51815471b96814707ffd1880e','605e37e0ba50494db3fddbbd19853f26','b1168f9741d344b6ade833667a92ae03','tttttt','32bf0e6fcff51e53bd74e70ba1d622b2',0,'1315d2b51815471b96814707ffd1880e',NULL,NULL,'NORMAL',1683799819875,'2023-05-11 18:10:19',NULL),('1a6a46939bb84846a73717c6d560d035','89e53ea14c1a45189634333bbc8694d4','b1168f9741d344b6ade833667a92ae03','aaaaa','594f803b380a41396ed63dca39503542',0,'1a6a46939bb84846a73717c6d560d035',NULL,NULL,'NORMAL',1683799956403,'2023-05-11 18:12:36',NULL),('b67469de52134fcf89b4f9a2649791f9','89e53ea14c1a45189634333bbc8694d4','973a6f7923fa407c9a40a17d987d9685','tttt','123',0,'b67469de52134fcf89b4f9a2649791f9',NULL,NULL,'NORMAL',1683793230106,'2023-05-11 16:20:30',NULL),('ce97133a99304040b4ca9218469a3989','605e37e0ba50494db3fddbbd19853f26','b1168f9741d344b6ade833667a92ae03','jack','202cb962ac59075b964b07152d234b70',0,'087afdf27e3244ffa4d4b05f21ee2c9b',NULL,NULL,'NORMAL',1658295862635,'2022-07-20 13:44:22',NULL),('d4cd8162669f41a4805e42ab0195904f','dfaf1162668545cfaa1120128e5dfbea','b1168f9741d344b6ade833667a92ae03','abbbbb','8cdf059a047fe53802394f3828dc4c92',0,'d4cd8162669f41a4805e42ab0195904f',NULL,NULL,'NORMAL',1683794461959,'2023-05-11 16:41:01',1683794510213);
/*!40000 ALTER TABLE `security_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_admin-info`
--

DROP TABLE IF EXISTS `security_admin-info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_admin-info` (
  `admin_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '管理员的uuid',
  `nick_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `real_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `gender` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '性别',
  `birthday_timestamp` bigint DEFAULT NULL COMMENT '生日时间戳',
  `birthday_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '生日时间',
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone_numbers` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话号码',
  `id_card_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份证件类型',
  `id_card_number` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份证件号码',
  `avatar` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `level` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '等级',
  `balance` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '余额',
  `score` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '分值',
  `points` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '积分',
  `last_login_ip` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后登入ip',
  `last_login_timestamp` bigint unsigned DEFAULT NULL COMMENT '最后登入时间戳',
  `last_login_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后登入时间',
  `last_update_timestamp` bigint unsigned DEFAULT NULL COMMENT '最后修改时间戳',
  `last_update_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后修改时间',
  PRIMARY KEY (`admin_uuid`),
  KEY `query` (`admin_uuid`,`nick_name`,`real_name`,`gender`,`birthday_timestamp`,`email`,`id_card_type`,`id_card_number`,`level`,`balance`,`score`,`points`,`last_login_ip`,`last_login_timestamp`,`last_update_timestamp`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='安全_管理员信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_admin-info`
--

LOCK TABLES `security_admin-info` WRITE;
/*!40000 ALTER TABLE `security_admin-info` DISABLE KEYS */;
INSERT INTO `security_admin-info` VALUES ('ce97133a99304040b4ca9218469a3989',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'192.168.10.7',1688033194000,'2023-06-29 18:06:34',NULL,NULL);
/*!40000 ALTER TABLE `security_admin-info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_menu`
--

DROP TABLE IF EXISTS `security_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_menu` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `parent_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '父级菜单的uuid',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `text` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文本',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `link` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '链接',
  `level` int unsigned NOT NULL COMMENT '级别',
  `order` int unsigned NOT NULL COMMENT '排序编号',
  `order_group` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '排序编号组',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`parent_uuid`,`name`,`level`,`order`,`order_group`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='安全_菜单';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_menu`
--

LOCK TABLES `security_menu` WRITE;
/*!40000 ALTER TABLE `security_menu` DISABLE KEYS */;
INSERT INTO `security_menu` VALUES ('0d6debc53c354627a51fdf1bd610f110','121170c6c4c4490b9883aa5c5fd2d90b','problemDepartmentTypeManagement','单位问题类型管理','单位问题类型管理。','../supervision_spot/problem_department_type_management.html',3,2,'000003000003000002',1677854985404,'2023-03-03 22:49:45',NULL),('121170c6c4c4490b9883aa5c5fd2d90b','b8eab51abf654483b42c7f380e0e7548','problemManagement','问题管理','问题管理。','',2,3,'000003000003',1658295862635,'2022-07-20 13:44:22',NULL),('141c5ad59f9942b4be6a758757c177e9','9f1f10bdb9724c40a83447128ef6c567','orgManagement','组织架构管理','组织架构的添加、删除、修改、删除等操作。','../security_center/org_management.html',3,6,'000001000001000006',1683702912245,'2023-05-10 15:15:12',NULL),('1dc6c636aa0e418ca54b4a56ec78d186','32264d4792b54d43b7df308500b580e4','testt','test','t','',4,12,'000003000005000001000012',1683351734051,'2023-05-06 13:42:14',NULL),('249416d8a5e24d73ae3d99ad48c2e714','b8eab51abf654483b42c7f380e0e7548','sysManagement','系统管理','系统管理。','',2,5,'000003000005',1672725167698,'2023-01-03 13:52:47',NULL),('2b0682fdc2e843dca1f57c784370dea3','9f1f10bdb9724c40a83447128ef6c567','orgTypeManagement','组织架构类型管理','组织架构类型的添加、删除、修改、删除等操作。','../security_center/org_type_management.html',3,5,'000001000001000005',1683703240634,'2023-05-10 15:20:40',NULL),('2cf88166caac4d67b82cc1fae9970368','aab30dad4f424cfaababaaddd4747e35','developDocument','开发文档','开发文档功能相关。','',2,1,'000002000001',1658295862635,'2022-07-20 13:44:22',NULL),('3020a24213eb46f3b400739a5f565ce8','9f1f10bdb9724c40a83447128ef6c567','adminManagement','管理员管理','后台管理员的添加、删除、修改、删除等操作。','../security_center/admin_management.html',3,7,'000001000001000007',1658295862635,'2022-07-20 13:44:22',1683793684179),('32264d4792b54d43b7df308500b580e4','249416d8a5e24d73ae3d99ad48c2e714','sysConfig2','系统配置2','系统配置2。','../supervision_spot/sys_config.html',3,1,'000003000005000001',1677221528778,'2023-02-24 14:52:08',NULL),('386e06bdccbe4dc29c3a7adb6b070f04','99fc9c7a112f4c36a80874cdd3a89da0','departmentTypeManagement','类型管理','类型管理。','../supervision_spot/department_type_management.html',3,1,'000003000001000001',1658295862635,'2022-07-20 13:44:22',NULL),('5a0883aa60154ca4b55a64000a3e3c32','9f1f10bdb9724c40a83447128ef6c567','rolePermission','角色权限','配置角色（系统级）使用的接口权限。','../security_center/role_permission.html',3,4,'000001000001000004',1658295862635,'2022-07-20 13:44:22',NULL),('5aec7f39f39641e88b2d2b84c8d37150','0','securityCenter','安全中心','系统安全功能相关。','',1,1,'000001',1658295862635,'2022-07-20 13:44:22',NULL),('845779fa9a43435ba9e3878e605771c2','9f1f10bdb9724c40a83447128ef6c567','roleMenu','角色菜单','配置角色（系统级）在后台管理中的菜单使用权限。','../security_center/role_menu.html',3,3,'000001000001000003',1658295862635,'2022-07-20 13:44:22',NULL),('99fc9c7a112f4c36a80874cdd3a89da0','b8eab51abf654483b42c7f380e0e7548','organizational_structure','组织架构','组织架构。','',2,1,'000003000001',1658295862635,'2022-07-20 13:44:22',NULL),('9f1f10bdb9724c40a83447128ef6c567','5aec7f39f39641e88b2d2b84c8d37150','accountSecurity','账户安全','账户安全功能相关。','',2,1,'000001000001',1658295862635,'2022-07-20 13:44:22',NULL),('a8d4947340584c90bd1bbfa863d7d06d','9f1f10bdb9724c40a83447128ef6c567','roleManagement','角色管理','角色（系统级）的添加、删除、修改、删除等操作。','../security_center/role_management.html',3,2,'000001000001000002',1658295862635,'2022-07-20 13:44:22',NULL),('aab30dad4f424cfaababaaddd4747e35','0','documentCenter','文档中心','文档功能相关。','',1,2,'000002',1658295862635,'2022-07-20 13:44:22',NULL),('b74a8edfbf5648fda7ae3b6f3a4370cc','2cf88166caac4d67b82cc1fae9970368','apiInterface','API接口','API接口。','../document_center/api.html',3,1,'000002000001000001',1658295862635,'2022-07-20 13:44:22',NULL),('b8eab51abf654483b42c7f380e0e7548','0','supervision_spot','现场督查','现场督查模块功能相关。','',1,3,'000003',1658295862635,'2022-07-20 13:44:22',NULL),('be56747855954ed4b2dda4393bd421ca','99fc9c7a112f4c36a80874cdd3a89da0','departmentManagement','单位管理','单位管理。','../supervision_spot/department_management.html',3,2,'000003000001000002',1677220369000,'2023-02-24 14:32:49',NULL),('d5d01dcbadcc4b3083b7ea4c308865b3','121170c6c4c4490b9883aa5c5fd2d90b','problemPersonTypeManagement','个人问题类型管理','个人问题类型管理。','../supervision_spot/problem_person_type_management.html',3,1,'000003000003000001',1658295862635,'2022-07-20 13:44:22',NULL),('d7554016092c4fd9a150ef566703a78e','9f1f10bdb9724c40a83447128ef6c567','menuManagement','菜单管理','管理后台菜单的添加、删除、修改、删除等操作。','../security_center/menu_management.html',3,1,'000001000001000001',1658295862635,'2022-07-20 13:44:22',NULL);
/*!40000 ALTER TABLE `security_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_org`
--

DROP TABLE IF EXISTS `security_org`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_org` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `parent_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '父级组织架构的uuid',
  `type_uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型的uuid',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `level` int unsigned NOT NULL COMMENT '级别',
  `order` int unsigned NOT NULL COMMENT '排序编号',
  `order_group` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '排序编号组',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`parent_uuid`,`type_uuid`,`level`,`order`,`order_group`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='安全_组织架构';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_org`
--

LOCK TABLES `security_org` WRITE;
/*!40000 ALTER TABLE `security_org` DISABLE KEYS */;
INSERT INTO `security_org` VALUES ('605e37e0ba50494db3fddbbd19853f26','0','0b515271ddf543588e6c3ccfe939b80f','锦绣蓝图',1,1,'000001',1679540713379,'2023-03-23 11:05:13',NULL),('89e53ea14c1a45189634333bbc8694d4','0','0b515271ddf543588e6c3ccfe939b80f','Sailing',1,2,'000002',1683710322421,'2023-05-10 17:18:42',NULL);
/*!40000 ALTER TABLE `security_org` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_org-type`
--

DROP TABLE IF EXISTS `security_org-type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_org-type` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `order` int unsigned NOT NULL COMMENT '排序编号',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`name`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='安全_组织架构类型';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_org-type`
--

LOCK TABLES `security_org-type` WRITE;
/*!40000 ALTER TABLE `security_org-type` DISABLE KEYS */;
INSERT INTO `security_org-type` VALUES ('0b515271ddf543588e6c3ccfe939b80f','总公司','总公司。',1,1679540713379,'2023-03-23 11:05:13',NULL),('2f7fc39a043d4fb8a95a8b31b7f82a33','子公司','子公司。',3,1683705079775,'2023-05-10 15:51:19',NULL),('c99b6644381045828791b9f82d7e4481','分公司','分公司。',2,1683705066239,'2023-05-10 15:51:06',NULL);
/*!40000 ALTER TABLE `security_org-type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_role`
--

DROP TABLE IF EXISTS `security_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_role` (
  `uuid` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '唯一标识',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '权限',
  `menus` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '菜单',
  `order` int unsigned NOT NULL COMMENT '排序编号',
  `create_timestamp` bigint unsigned NOT NULL COMMENT '创建时间戳',
  `create_datetime` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `remove_timestamp` bigint unsigned DEFAULT NULL COMMENT '删除时间戳',
  PRIMARY KEY (`uuid`),
  KEY `query` (`uuid`,`name`,`create_timestamp`,`remove_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='安全_角色';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_role`
--

LOCK TABLES `security_role` WRITE;
/*!40000 ALTER TABLE `security_role` DISABLE KEYS */;
INSERT INTO `security_role` VALUES ('066fe6d56fe14b0eb75550f72221e5cc','t5',NULL,NULL,NULL,3,1683271683664,'2023-05-05 15:28:03',1683274209229),('2b91f38fadc4415cb11d25aa698191a5','t4','',NULL,NULL,3,1683271679333,'2023-05-05 15:27:59',1683274221353),('61ec007c03c04637bd9e8c384f0b23cf','t3','',NULL,NULL,3,1683267953861,'2023-05-05 14:25:53',1683271657696),('973a6f7923fa407c9a40a17d987d9685','test','测试',NULL,NULL,2,1683253937756,'2023-05-05 10:32:17',NULL),('9e5d15a0344941fa89750816520519eb','t2',NULL,'security.Admin.addAdmin;security.Menu.addMenu;security.Org.addOrg;security.OrgType.addOrgType;security.Role.addRole;security.Admin.adminLogin;security.Admin.adminLogoff;security.Admin.getAdmin;security.Admin.getAdminInfo;security.Admin.getAdminInfoBySelf;security.Menu.getChildMenu;security.Menu.getMenu;security.ModuleMethod.getModuleMethod;security.Org.getOrg;security.OrgType.getOrgType;security.Menu.getParentMenu;security.Org.getParentOrg;security.Role.getRole;security.Role.getRoleBySelf;security.Admin.modifyAdmin;security.Admin.modifyAdminInfo;security.Admin.modifyAdminInfoBySelf;security.Admin.modifyAdminPasswordBySelf;security.Menu.modifyMenu;security.Org.modifyOrg;security.OrgType.modifyOrgType;security.Role.modifyRole;security.Admin.refreshAdminToken;security.Admin.removeAdmin;security.Menu.removeMenu;security.Org.removeOrg;security.OrgType.removeOrgType;security.Role.removeRole;','5a0883aa60154ca4b55a64000a3e3c32;',3,1683271670738,'2023-05-05 15:27:50',NULL),('b1168f9741d344b6ade833667a92ae03','superadmin','超级管理员，拥有所有权限。','*','5aec7f39f39641e88b2d2b84c8d37150;9f1f10bdb9724c40a83447128ef6c567;d7554016092c4fd9a150ef566703a78e;a8d4947340584c90bd1bbfa863d7d06d;845779fa9a43435ba9e3878e605771c2;5a0883aa60154ca4b55a64000a3e3c32;2b0682fdc2e843dca1f57c784370dea3;141c5ad59f9942b4be6a758757c177e9;aab30dad4f424cfaababaaddd4747e35;2cf88166caac4d67b82cc1fae9970368;b74a8edfbf5648fda7ae3b6f3a4370cc;b8eab51abf654483b42c7f380e0e7548;99fc9c7a112f4c36a80874cdd3a89da0;386e06bdccbe4dc29c3a7adb6b070f04;be56747855954ed4b2dda4393bd421ca;121170c6c4c4490b9883aa5c5fd2d90b;d5d01dcbadcc4b3083b7ea4c308865b3;0d6debc53c354627a51fdf1bd610f110;249416d8a5e24d73ae3d99ad48c2e714;32264d4792b54d43b7df308500b580e4;',1,1658295862635,'2022-07-20 13:44:22',NULL),('cd7886cf31584c088742cca673b50acf','t3',NULL,NULL,'d7554016092c4fd9a150ef566703a78e;845779fa9a43435ba9e3878e605771c2;',3,1683271675518,'2023-05-05 15:27:55',NULL),('faa27ab44a214f5a9579a24ae736cd7f','t1',NULL,NULL,NULL,11,1683271664864,'2023-05-05 15:27:44',NULL);
/*!40000 ALTER TABLE `security_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-06 16:48:21
