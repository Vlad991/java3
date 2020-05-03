ALTER TABLE `orders` ADD COLUMN `source_value` CHARACTER VARYING(255) NOT NULL;
ALTER TABLE `orders` ADD COLUMN `source_info` CHARACTER VARYING(255);

UPDATE
  `orders`
SET
  `source_value` = 'MANUAL',
  `source_info` = `source`
WHERE
  `source` <> 'ebay';

UPDATE
  `orders`
SET
  `source_value` = 'EBAY',
  `source_info` = 'EBAY'
WHERE
  `source` = 'ebay';

ALTER TABLE `orders` DROP COLUMN `source`;