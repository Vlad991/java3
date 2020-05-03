START TRANSACTION;

CREATE TABLE warehouse_items
(
  id                            BIGINT                  NOT NULL AUTO_INCREMENT,
  article_number                CHARACTER VARYING(255)  NOT NULL,
  real_article_number           CHARACTER VARYING(255)  NOT NULL,
  article_name	                CHARACTER VARYING(255)  DEFAULT NULL,
  supplier_name                 CHARACTER VARYING(255)  DEFAULT NULL,
  warehouse_amount              INT                     NOT NULL,
  min_warehouse_amount          INT                     DEFAULT 0,
  supplier_amount               INT                     DEFAULT 0,
  supplier_last_update          BIGINT                  DEFAULT 0,
  warehouse_rack                CHARACTER VARYING(255)  DEFAULT 'VIRTUAL',
  ebay_plus_flag                BOOLEAN 			          DEFAULT FALSE,
  supplier_last_order_date      BIGINT                  DEFAULT 0,
  planned_income_date           BIGINT                  DEFAULT 0,
  send_back_to_supplier         BOOLEAN 			          DEFAULT FALSE,
  dimensions_id                 BIGINT                  DEFAULT NULL,
  comments                      CHARACTER VARYING(255)  DEFAULT NULL,

  CONSTRAINT warehouse_items_pkey PRIMARY KEY (id),
  UNIQUE(article_number)
);

CREATE TABLE warehouse_reservation_items
(
  id                    BIGINT            NOT NULL AUTO_INCREMENT,
  warehouse_item_id     BIGINT            NOT NULL,
  order_item_id         BIGINT            NOT NULL,
  reservation_amount    INT               DEFAULT 0,
  CONSTRAINT warehouse_reservation_item_pkey PRIMARY KEY (id),
  FOREIGN KEY (warehouse_item_id) REFERENCES warehouse_items (id)
);

create table warehouse_item_dimensions
(
  id                  BIGINT                  NOT NULL AUTO_INCREMENT,
  article_number      CHARACTER VARYING(255)  NOT NULL,
  length              INT                     DEFAULT 0,
  width               INT                     DEFAULT 0,
  height              INT                     DEFAULT 0,
  gross_weight        FLOAT(6,3)              DEFAULT 0,
  CONSTRAINT warehouse_item_dimensions_pkey PRIMARY KEY (id),
  UNIQUE(article_number)
  );

CREATE INDEX warehouse_items__article_number_idx ON warehouse_items (article_number(10));
CREATE INDEX warehouse_item_dimensions__article_number_idx ON warehouse_item_dimensions (article_number(10));

ALTER TABLE items ADD COLUMN reservation_state CHARACTER VARYING(255) NOT NULL DEFAULT 'INITIAL';
ALTER TABLE items ADD COLUMN warehouse_rack CHARACTER VARYING(255);
ALTER TABLE items ADD COLUMN can_be_ordered BOOLEAN DEFAULT TRUE;

create table supplier_import_items
(
  id                  BIGINT NOT NULL AUTO_INCREMENT,
  supplier            CHARACTER VARYING(255)  NOT NULL,
  file_name           CHARACTER VARYING(255)  NOT NULL,
  data                MEDIUMBLOB,
  upload_date         BIGINT                  DEFAULT 0,
  uploaded_by         CHARACTER VARYING(255)  NOT NULL,
  status              INT                     DEFAULT NULL,
  update_date         BIGINT                  DEFAULT 0,
  CONSTRAINT supplier_import_items_pkey PRIMARY KEY (id)
);

ALTER TABLE `items` CHANGE `comments` `comments` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `warehouse_items` CHANGE `comments` `comments` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

COMMIT;