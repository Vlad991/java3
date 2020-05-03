START TRANSACTION;

CREATE TABLE transactions
(
  `id`                BIGINT                 NOT NULL AUTO_INCREMENT,
  `source`            CHARACTER VARYING(255) NOT NULL,
  `timestamp`         DATETIME               NOT NULL,
  `amount_cents`      BIGINT                 NOT NULL,
  `amount_currency`   CHARACTER VARYING(25),
  `name`              CHARACTER VARYING(255),
  `description`       CHARACTER VARYING(255),
  `notes`             CHARACTER VARYING(255),

  `account_number`    CHARACTER VARYING(255),
  `bank_code`         CHARACTER VARYING(255),
  `reference_info`    CHARACTER VARYING(255),

  `email_from`        CHARACTER VARYING(255),
  `email_to`          CHARACTER VARYING(255),
  `article_number`    CHARACTER VARYING(255),
  `individual_number` CHARACTER VARYING(255),
  `invoice_number`    CHARACTER VARYING(255),
  `buyer_id`          CHARACTER VARYING(255),
  `address_id`        BIGINT,
  `phone_number`      CHARACTER VARYING(255),

  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  FOREIGN KEY (address_id) REFERENCES addresses (id)
);

COMMIT;