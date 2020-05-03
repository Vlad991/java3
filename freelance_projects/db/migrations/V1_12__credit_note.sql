ALTER TABLE `orders` ADD COLUMN `credit_note_number` CHARACTER VARYING(100) DEFAULT NULL;
ALTER TABLE `orders` ADD COLUMN `credit_note_issued_on` DATETIME DEFAULT NULL;
ALTER TABLE `orders` ADD COLUMN `credit_note_file_id` BIGINT DEFAULT NULL;
CREATE INDEX idx_orders__credit_note_number ON `orders` (`credit_note_number`);
ALTER TABLE `orders` ADD FOREIGN KEY (`credit_note_file_id`) REFERENCES `files` (id);

CREATE TABLE credit_note_numbers
(
  year                       INT    NOT NULL,
  current_credit_note_number BIGINT NOT NULL,

  CONSTRAINT credit_note_numbers_pkey PRIMARY KEY (year)
);

DELIMITER $$

CREATE PROCEDURE next_credit_note_number(IN credit_note_year INT, OUT next_credit_note_number BIGINT)
  BEGIN
    SELECT current_credit_note_number + 1
    INTO
      next_credit_note_number
    FROM
      credit_note_numbers
    WHERE
      year = credit_note_year;

    IF next_credit_note_number IS NULL
    THEN
      SET next_credit_note_number = 1;
      INSERT INTO
        credit_note_numbers (year, current_credit_note_number)
      VALUES
        (credit_note_year, 1);
    END IF;

    UPDATE
      credit_note_numbers
    SET
      current_credit_note_number = next_credit_note_number
    WHERE
      year = credit_note_year;
  END$$

DELIMITER ;