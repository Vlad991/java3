CREATE TABLE files
(
  id        BIGINT                 NOT NULL AUTO_INCREMENT,
  file_name CHARACTER VARYING(255) NOT NULL,
  data      MEDIUMBLOB,

  CONSTRAINT files_pkey PRIMARY KEY (id)
);

ALTER TABLE `orders` ADD COLUMN `vat_percentage` DECIMAL(5, 2) DEFAULT 0.0;
ALTER TABLE `orders` MODIFY `vat_percentage` DECIMAL(5, 2) NOT NULL;

ALTER TABLE `orders` ADD COLUMN `invoice_number` CHARACTER VARYING(100) DEFAULT NULL;
CREATE INDEX idx_orders__invoice_number ON `orders` (`invoice_number`);
ALTER TABLE `orders` ADD COLUMN `invoiced_on` DATETIME DEFAULT NULL;

ALTER TABLE `orders` ADD COLUMN `invoice_file_id` BIGINT DEFAULT NULL;
ALTER TABLE `orders` ADD FOREIGN KEY (`invoice_file_id`) REFERENCES `files` (id);

CREATE TABLE invoice_numbers
(
  year                   INT    NOT NULL,
  current_invoice_number BIGINT NOT NULL,

  CONSTRAINT invoice_numbers_pkey PRIMARY KEY (year)
);

DELIMITER $$

CREATE PROCEDURE next_invoice_number(IN invoicing_year INT, OUT next_invoice_number BIGINT)
  BEGIN
    SELECT current_invoice_number + 1
    INTO
      next_invoice_number
    FROM
      invoice_numbers
    WHERE
      year = invoicing_year;

    IF next_invoice_number IS NULL
    THEN
      SET next_invoice_number = 1;
      INSERT INTO
        invoice_numbers (year, current_invoice_number)
      VALUES
        (invoicing_year, 1);
    END IF;

    UPDATE
      invoice_numbers
    SET
      current_invoice_number = next_invoice_number
    WHERE
      year = invoicing_year;
  END$$

DELIMITER ;