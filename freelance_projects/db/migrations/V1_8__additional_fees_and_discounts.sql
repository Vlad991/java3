ALTER TABLE `orders` ADD COLUMN `paid_on` DATETIME;
ALTER TABLE `orders` ADD COLUMN `customer_comment` TEXT;

ALTER TABLE `orders` ADD COLUMN `discount_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `discount_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `delivery_price_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `delivery_price_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `payment_processing_fee_amount` INT DEFAULT 0;
ALTER TABLE `orders` MODIFY `payment_processing_fee_amount` INT NOT NULL;

ALTER TABLE `items` ADD COLUMN `discount_amount` INT DEFAULT 0;
ALTER TABLE `items` MODIFY `discount_amount` INT NOT NULL;

UPDATE
  orders
SET
  payment_details = 'Zahlung bei Lieferung'
WHERE
  payment_details = 'CASH_ON_PICKUP';

UPDATE
  orders
SET
  payment_details = 'Vorkasse'
WHERE
  payment_details = 'MONEY_XFER_ACCEPTED_IN_CHECKOUT' OR payment_details = 'MONEY_XFER_ACCEPTED' OR payment_details = 'moneyorder' OR
  payment_details = 'oxidpayadvance';

UPDATE
  orders
SET
  payment_details = 'Nachnahme'
WHERE
  payment_details = 'COD' OR payment_details = 'cod' OR payment_details = 'oxidcashondel';

UPDATE
  orders
SET
  payment_details = 'PayPal'
WHERE
  payment_details = 'PAY_PAL' OR payment_details = 'paypal' OR payment_details = 'oxidpaypal';

UPDATE
  orders
SET
  payment_details = '-'
WHERE
  payment_details = 'oxempty';