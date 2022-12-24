# CREATE DATABASE secrets;
# CREATE USER 'vault'@'%' IDENTIFIED BY 'password';
# GRANT ALL PRIVILEGES ON secrets.* TO 'vault'@'%' WITH GRANT OPTION;
# GRANT CREATE USER ON *.* to 'vault'@'%';

CREATE DATABASE safehomeapi;
CREATE USER 'vault'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON safehomeapi.* TO 'vault'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* to 'vault'@'%';
# GRANT CREATE USER ON *.* to 'vault'@'%';