UPDATE
  `jobs_states`
SET
  `last_execution_time`            = '2015-04-01 00:00:00',
  `last_successful_execution_time` = '2015-04-01 00:00:00'
WHERE
  `name` = 'EBAY_IMPORT';