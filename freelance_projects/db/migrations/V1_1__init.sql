CREATE TABLE users
(
  id       BIGINT                 NOT NULL AUTO_INCREMENT,
  password CHARACTER VARYING(255) NOT NULL,
  username CHARACTER VARYING(255) NOT NULL,
  roles    CHARACTER VARYING(255) NOT NULL,
  name     CHARACTER VARYING(255) NOT NULL,

  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE addresses
(
  id                 BIGINT NOT NULL AUTO_INCREMENT,
  name               CHARACTER VARYING(255) DEFAULT NULL,
  company            CHARACTER VARYING(255) DEFAULT NULL,
  street1            CHARACTER VARYING(255) DEFAULT NULL,
  street2            CHARACTER VARYING(255) DEFAULT NULL,
  postal_code        CHARACTER VARYING(255) DEFAULT NULL,
  city               CHARACTER VARYING(255) DEFAULT NULL,
  country            CHARACTER VARYING(255) DEFAULT NULL,
  phone_number       CHARACTER VARYING(255) DEFAULT NULL,
  external_reference CHARACTER VARYING(255) DEFAULT NULL,

  CONSTRAINT addresses_pkey PRIMARY KEY (id)
);

CREATE TABLE customers
(
  id                 BIGINT NOT NULL AUTO_INCREMENT,
  name               CHARACTER VARYING(255) DEFAULT NULL,
  alias              CHARACTER VARYING(255) DEFAULT NULL,
  phone_number       CHARACTER VARYING(255) DEFAULT NULL,
  email              CHARACTER VARYING(255) DEFAULT NULL,
  external_reference CHARACTER VARYING(255) DEFAULT NULL,

  CONSTRAINT customers_pkey PRIMARY KEY (id)
);

CREATE TABLE orders
(
  id                       BIGINT                 NOT NULL AUTO_INCREMENT,
  customer_id              BIGINT                 NOT NULL,
  status                   CHARACTER VARYING(255) NOT NULL,
  created_on               DATETIME               NOT NULL,
  delivery_address_id      BIGINT                 NOT NULL,
  billing_address_id       BIGINT                 NOT NULL,
  external_reference       CHARACTER VARYING(255) NOT NULL,
  sale_record_number       CHARACTER VARYING(255) NOT NULL,
  source                   CHARACTER VARYING(255) NOT NULL,
  shipped_on               DATETIME DEFAULT NULL,
  payment_details          CHARACTER VARYING(255) DEFAULT NULL,
  delivery_service         CHARACTER VARYING(255) DEFAULT NULL,
  delivery_tracking_number CHARACTER VARYING(255) DEFAULT NULL,
  assignee_id              BIGINT DEFAULT NULL,

  CONSTRAINT orders_pkey PRIMARY KEY (id),
  FOREIGN KEY (assignee_id) REFERENCES users (id),
  FOREIGN KEY (customer_id) REFERENCES customers (id),
  FOREIGN KEY (delivery_address_id) REFERENCES addresses (id),
  FOREIGN KEY (billing_address_id) REFERENCES addresses (id)
);

CREATE TABLE items
(
  id                     BIGINT                 NOT NULL AUTO_INCREMENT,
  order_id               BIGINT                 NOT NULL,
  name                   CHARACTER VARYING(255) NOT NULL,
  article_number         CHARACTER VARYING(255) NOT NULL,
  amount                 INT                    NOT NULL,
  price_amount           INT                    NOT NULL,
  price_currency         CHARACTER VARYING(10)  NOT NULL,
  external_reference     CHARACTER VARYING(255) NOT NULL,
  reference_number_oe    CHARACTER VARYING(255) DEFAULT NULL,
  reference_number_oem   CHARACTER VARYING(255) DEFAULT NULL,
  reference_number_other CHARACTER VARYING(255) DEFAULT NULL,
  sale_record_number     CHARACTER VARYING(255) DEFAULT NULL,
  ordered_from           CHARACTER VARYING(255) DEFAULT NULL,
  eta                    DATETIME DEFAULT NULL,

  CONSTRAINT items_pkey PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE TABLE comments
(
  id       BIGINT   NOT NULL AUTO_INCREMENT,
  order_id BIGINT   NOT NULL,
  added_by BIGINT   NOT NULL,
  added_on DATETIME NOT NULL,
  text     CHARACTER VARYING(4000) DEFAULT NULL,

  CONSTRAINT comments_pkey PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (added_by) REFERENCES users (id)
);


CREATE TABLE jobs_states
(
  id                             BIGINT                 NOT NULL AUTO_INCREMENT,
  name                           CHARACTER VARYING(255) NOT NULL,
  last_execution_time            DATETIME               NOT NULL,
  last_successful_execution_time DATETIME               NOT NULL,
  last_was_successful            BOOLEAN                NOT NULL,

  CONSTRAINT jobs_states_pkey PRIMARY KEY (id)
);


INSERT INTO users (id, username, password, roles, name)
VALUES (1, 'test', '$2a$10$Lk9OETilm6irUGHghoUOpO4.pM2hCgqY/3IzZObTHaQQldX3frJfi', 'user, admin', 'John Tester');