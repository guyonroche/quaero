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

CREATE TABLE `quaero`.`question_tags` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `question_id` BIGINT NOT NULL,
  `tag` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `tag_idx` (`tag` ASC));
