-- ORDERS

ALTER TABLE `orders` DROP COLUMN `delivery_price_amount`;
ALTER TABLE `orders` DROP COLUMN `payment_processing_fee_amount`;
ALTER TABLE `orders` DROP COLUMN `discount_amount`;
ALTER TABLE `orders` DROP COLUMN `vat_percentage`;

ALTER TABLE `orders` ADD COLUMN `order_currency` CHARACTER VARYING(10);
UPDATE `orders`
  JOIN `items` ON `items`.`order_id` = `orders`.`id`
SET `orders`.`order_currency` = `items`.`price_currency`;
ALTER TABLE `orders` MODIFY COLUMN `order_currency` CHARACTER VARYING(10) NOT NULL;

ALTER TABLE `orders` ADD COLUMN `vat_percentage` DECIMAL(5, 2) DEFAULT 0.0;
ALTER TABLE `orders` MODIFY `vat_percentage` DECIMAL(5, 2) NOT NULL;

ALTER TABLE `orders` ADD COLUMN `items_total_price_netto_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `items_total_price_netto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `discount_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `discount_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `delivery_price_netto_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `delivery_price_netto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `delivery_price_brutto_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `delivery_price_brutto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `payment_processing_fee_netto_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `payment_processing_fee_netto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `payment_processing_fee_brutto_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `payment_processing_fee_brutto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `vat_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `vat_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `total_price_netto_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `total_price_netto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `total_price_brutto_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `total_price_brutto_amount` INT NOT NULL;

-- ITEMS

ALTER TABLE `items` ADD COLUMN `price_netto_amount` INT DEFAULT 0;
ALTER TABLE `items` MODIFY `price_netto_amount` INT NOT NULL;

ALTER TABLE `items` ADD COLUMN `price_brutto_amount` INT DEFAULT 0;
ALTER TABLE `items` MODIFY `price_brutto_amount` INT NOT NULL;

UPDATE `items`
SET `price_netto_amount` = `price_amount`, `price_brutto_amount` = `price_amount`;

ALTER TABLE `items` DROP COLUMN `price_amount`;
ALTER TABLE `items` DROP COLUMN `price_currency`;