UPDATE
  users
SET
  username = 'admin',
  password = '$2a$10$0Lp9.j9dQHU3NXNlGow8Xuh/afUcSHEDEIaJRIqc8448tRANnhS7W',
  roles = 'user, admin',
  name = 'Administrator'
WHERE
  id = 1;
