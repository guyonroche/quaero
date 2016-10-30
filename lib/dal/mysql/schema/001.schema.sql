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
