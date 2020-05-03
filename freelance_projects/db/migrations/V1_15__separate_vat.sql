START TRANSACTION;

ALTER TABLE `orders` ADD COLUMN `delivery_price_vat_percentage` DECIMAL(5, 2) DEFAULT 0.0;
ALTER TABLE `orders` ADD COLUMN `delivery_price_vat_amount` INT DEFAULT 0;
ALTER TABLE `orders` ADD COLUMN `payment_processing_fee_vat_percentage` DECIMAL(5, 2) DEFAULT 0.0;
ALTER TABLE `orders` ADD COLUMN `payment_processing_fee_vat_amount` INT DEFAULT 0;

UPDATE `orders` SET `delivery_price_vat_percentage` = `vat_percentage`;
UPDATE `orders` SET `delivery_price_vat_amount` = `delivery_price_brutto_amount` - `delivery_price_netto_amount`;

UPDATE `orders` SET `payment_processing_fee_vat_percentage` = `vat_percentage`;
UPDATE `orders` SET `payment_processing_fee_vat_amount` = `payment_processing_fee_brutto_amount` - `payment_processing_fee_netto_amount`;


ALTER TABLE `orders` MODIFY `delivery_price_vat_percentage` DECIMAL(5, 2) NOT NULL;
ALTER TABLE `orders` MODIFY `delivery_price_vat_amount` INT NOT NULL;
ALTER TABLE `orders` MODIFY `payment_processing_fee_vat_percentage` DECIMAL(5, 2) NOT NULL;
ALTER TABLE `orders` MODIFY `payment_processing_fee_vat_amount` INT NOT NULL;

COMMIT;