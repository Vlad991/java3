CREATE TABLE warehouse_item_prices
(
  article_number                 CHARACTER VARYING(255)  NOT NULL PRIMARY KEY,
  amount_cents                   BIGINT   NOT NULL,
  amount_currency                TEXT(3)  NOT NULL,
  updated_on                     DATE     NOT NULL
);
