CREATE INDEX idx_orders__external_reference       ON orders   (external_reference);
CREATE INDEX idx_orders__sale_record_number       ON orders   (sale_record_number);
CREATE INDEX idx_orders__delivery_tracking_number ON orders   (delivery_tracking_number);
CREATE INDEX idx_orders__created_on               ON orders   (created_on);
CREATE INDEX idx_orders__shipped_on               ON orders   (shipped_on);
CREATE INDEX idx_orders__source_value             ON orders   (source_value);
CREATE INDEX idx_orders__source_info              ON orders   (source_info);
CREATE INDEX idx_orders__payment_details          ON orders   (payment_details);
CREATE INDEX idx_orders__status                   ON orders   (`status`);

CREATE INDEX idx_items__eta                       ON items    (eta);
CREATE INDEX idx_items__ordered_from              ON items    (ordered_from);
CREATE INDEX idx_items__name                      ON items    (`name`);
CREATE INDEX idx_items__article_number            ON items    (article_number);
CREATE INDEX idx_items__external_reference        ON items    (external_reference);
CREATE INDEX idx_items__sale_record_number        ON items    (sale_record_number);

CREATE INDEX idx_customers__name                  ON customers (`name`);
CREATE INDEX idx_customers__alias                 ON customers (alias);
CREATE INDEX idx_customers__phone_number          ON customers (phone_number);
CREATE INDEX idx_customers__email                 ON customers (`email`);
CREATE INDEX idx_customers__external_reference    ON customers (external_reference);
CREATE INDEX idx_customers__vat_number            ON customers (vat_number);

CREATE INDEX idx_addresses__name                  ON addresses (`name`);
CREATE INDEX idx_addresses__company               ON addresses (company);
CREATE INDEX idx_addresses__street1               ON addresses (street1);
CREATE INDEX idx_addresses__street2               ON addresses (street2);
CREATE INDEX idx_addresses__postal_code           ON addresses (postal_code);
CREATE INDEX idx_addresses__city                  ON addresses (city);
CREATE INDEX idx_addresses__country               ON addresses (country);
CREATE INDEX idx_addresses__phone_number          ON addresses (phone_number);