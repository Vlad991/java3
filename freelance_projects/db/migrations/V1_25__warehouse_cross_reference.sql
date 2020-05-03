START TRANSACTION;

CREATE TABLE warehouse_cross_references
(
  article_number                CHARACTER VARYING(255)  NOT NULL,
  real_article_number           CHARACTER VARYING(255)  NOT NULL,
  supplier                      CHARACTER VARYING(255)  NOT NULL,
  PRIMARY KEY (article_number, real_article_number)
);

ALTER TABLE warehouse_items DROP COLUMN real_article_number;

ALTER TABLE warehouse_cross_references CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

COMMIT;