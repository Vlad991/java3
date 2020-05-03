START TRANSACTION;

ALTER TABLE `items` ADD COLUMN `discount_percentage` DECIMAL(5, 2);

UPDATE `items` SET `discount_percentage` = ROUND(`discount_amount` / `price_netto_amount` * 100, 2);
UPDATE `items` SET `discount_percentage` = 100.00 WHERE `discount_percentage` > 100.00;

COMMIT;