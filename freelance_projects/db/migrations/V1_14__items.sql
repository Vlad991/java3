START TRANSACTION;

ALTER TABLE `items` ADD COLUMN `type` VARCHAR(20) DEFAULT 'ORDER_ITEM';
ALTER TABLE `items` MODIFY `type` VARCHAR(20) NOT NULL;

ALTER TABLE `items` ADD COLUMN `comments` VARCHAR(255) DEFAULT NULL;

COMMIT;