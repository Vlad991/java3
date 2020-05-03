START TRANSACTION;

CREATE TABLE IF NOT EXISTS inbound_invoices
(
  id              BIGINT                 NOT NULL AUTO_INCREMENT,
  invoice_date    DATE                   NOT NULL,
  supplier        CHARACTER VARYING(255) NOT NULL,
  invoice_number  CHARACTER VARYING(255) NOT NULL,
  amount_cents    BIGINT                 NOT NULL,
  amount_currency TEXT(3)                NOT NULL,
  paid_on         DATE                            DEFAULT NULL,
  pay_till        DATE                            DEFAULT NULL,
  service_supplier BOOLEAN               NOT NULL DEFAULT FALSE,
  source          CHARACTER VARYING(255)          DEFAULT NULL,
  comment         CHARACTER VARYING(255)          DEFAULT NULL,

  CONSTRAINT inbound_invoices_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_inbound_invoices__invoice_number ON inbound_invoices (invoice_number);

CREATE TABLE IF NOT EXISTS inbound_invoice_items (
  id                 BIGINT                 NOT NULL AUTO_INCREMENT,
  inbound_invoice_id BIGINT                 NOT NULL,
  article_number     CHARACTER VARYING(255) NOT NULL,
  amount_cents       BIGINT                 NOT NULL,
  amount_currency    TEXT(3)                NOT NULL,
  quantity           INT                    NOT NULL,
  description        CHARACTER VARYING(255) NOT NULL,

  CONSTRAINT inbound_invoices_items_pkey PRIMARY KEY (id),
  FOREIGN KEY (inbound_invoice_id) REFERENCES inbound_invoices (id)
);

CREATE TABLE IF NOT EXISTS accounting_reports (
  id                 BIGINT                 NOT NULL AUTO_INCREMENT,
  from_date          DATE                   NOT NULL,
  to_date            DATE                   NOT NULL,
  type               CHARACTER VARYING(255) NOT NULL,
  generated_on       DATETIME               NOT NULL,
  status             CHARACTER VARYING(255) NOT NULL,
  content            MEDIUMBLOB,
  CONSTRAINT accounting_reports_pkey PRIMARY KEY (id)
);

COMMIT;