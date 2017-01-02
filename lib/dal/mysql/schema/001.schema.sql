-- Execute the sql files in this folder in order

CREATE SCHEMA `quaero` DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci ;

USE `quaero`;

CREATE TABLE `quaero_user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL,
  `password` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC));

CREATE TABLE `quaero_session` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `sid` VARCHAR(128) NOT NULL,
  `expires` DATETIME NOT NULL,
  `user_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sid_UNIQUE` (`sid` ASC));

CREATE TABLE `question` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `quid` VARCHAR(32) NOT NULL,
  `created` DATETIME NOT NULL,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(128) NOT NULL,
  `text` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title_UNIQUE` (`title`),
  UNIQUE KEY `quid_UNIQUE` (`quid`)
);

CREATE TABLE `answer` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `question_id` BIGINT NOT NULL,
  `created` DATETIME NOT NULL,
  `user_id` BIGINT NOT NULL,
  `text` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id_idx` (`question_id`)
);

CREATE TABLE `question_tags` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `question_id` BIGINT NOT NULL,
  `tag` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `qt_idx` (`tag`,`question_id`),
  KEY `question_id_idx` (`question_id`)
);

CREATE TABLE `quaero_watch` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `quid` VARCHAR(32) NOT NULL,
  `last_modified` DATETIME NOT NULL,
  `watching` TINYINT ZEROFILL NOT NULL,
  `viewing` TINYINT ZEROFILL NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC),
  UNIQUE INDEX `user_quid_idx` (`user_id` ASC, `quid` ASC));

