INSERT INTO receivers
VALUES ('1', 'dominik', 'telegram', '-787810876', "{"name":"dominik"}", '2022-07-07 11:15:01', '2022-07-07 11:15:01');

INSERT INTO alert_types
VALUES ('1', 'typ1', '500', '3', '2022-07-07 11:15:01', '2022-07-07 11:15:01');

INSERT INTO locations
VALUES ('1', 'lokacja', '1', '1', 'url', '3', '2022-07-07 11:15:01', '2022-07-07 11:15:01');

INSERT INTO alert_type_receivers
VALUES ('1', '1', '1', '1', '3', '2022-07-07 11:15:01', '2022-07-07 11:15:01');

INSERT INTO types
VALUES ('1', 'typ1', '1','2022-07-07 11:15:01', '2022-07-07 11:15:01');

INSERT INTO devices
VALUES ('1', '1', '1', 'urzadzenie', '1', '2', 'params', 'details', '2022-07-07 11:15:01', '2022-07-07 11:15:01');

INSERT INTO alerts
VALUES ('1', '1', '1', '1', 'jakas wiadomosc', '0', '1','2022-07-07 11:15:01', '2022-07-07 11:15:01');

INSERT INTO alert_receivers
VALUES ('1', '1', '1', '2022-07-07 11:15:01', '2022-07-07 11:15:01');

UPDATE alert_type_receivers
SET interval_receiver = '2'
WHERE id= 2;


CREATE INDEX idx_location
ON locations (id);