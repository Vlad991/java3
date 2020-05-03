START TRANSACTION;

ALTER TABLE warehouse_item_dimensions MODIFY gross_weight INT;
ALTER TABLE warehouse_items DROP COLUMN warehouse_amount;
ALTER TABLE warehouse_reservation_items DROP COLUMN reservation_amount;
ALTER TABLE warehouse_reservation_items MODIFY COLUMN order_item_id BIGINT DEFAULT NULL;

COMMIT;