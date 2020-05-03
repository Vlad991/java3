START TRANSACTION;

CREATE TABLE credit_notes
(
  id                             BIGINT  NOT NULL AUTO_INCREMENT,
  include_delivery_price         BOOLEAN NOT NULL,
  include_payment_processing_fee BOOLEAN NOT NULL,
  include_discount               BOOLEAN NOT NULL,

  CONSTRAINT credit_notes_pkey PRIMARY KEY (id)
);

CREATE TABLE credit_note_items
(
  id             BIGINT NOT NULL AUTO_INCREMENT,
  credit_note_id BIGINT NOT NULL,
  item_id        BIGINT NOT NULL,

  CONSTRAINT credit_note_items_pkey PRIMARY KEY (id),
  FOREIGN KEY (credit_note_id) REFERENCES credit_notes (id)
);

ALTER TABLE `orders` ADD COLUMN `effective_items_total_price_netto_amount` INT DEFAULT 0;
UPDATE `orders` SET `effective_items_total_price_netto_amount` = `items_total_price_netto_amount`;
ALTER TABLE `orders` MODIFY `effective_items_total_price_netto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `effective_vat_amount` INT DEFAULT 0;
UPDATE `orders` SET `effective_vat_amount` = `vat_amount`;
ALTER TABLE `orders` MODIFY `effective_vat_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `effective_total_price_netto_amount` INT DEFAULT 0;
UPDATE `orders` SET `effective_total_price_netto_amount` = `total_price_netto_amount`;
ALTER TABLE `orders` MODIFY `effective_total_price_netto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `effective_total_price_brutto_amount` INT DEFAULT 0;
UPDATE `orders` SET `effective_total_price_brutto_amount` = `total_price_brutto_amount`;
ALTER TABLE `orders` MODIFY `effective_total_price_brutto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `original_total_price_netto_amount` INT DEFAULT 0;
UPDATE `orders` SET `original_total_price_netto_amount` = `total_price_netto_amount`;
ALTER TABLE `orders` MODIFY `original_total_price_netto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `original_total_price_brutto_amount` INT DEFAULT 0;
UPDATE `orders` SET `original_total_price_brutto_amount` = `total_price_brutto_amount`;
ALTER TABLE `orders` MODIFY `original_total_price_brutto_amount` INT NOT NULL;

ALTER TABLE `orders` ADD COLUMN `credit_note_id` BIGINT DEFAULT NULL;
ALTER TABLE `orders` ADD CONSTRAINT FOREIGN KEY (credit_note_id) REFERENCES credit_notes (id);

COMMIT;