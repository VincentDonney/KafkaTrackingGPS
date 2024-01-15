CREATE DATABASE pg;
USE pg;

CREATE TABLE coordinates (
    id INTEGER,
    timestamp TIMESTAMP NOT NULL,
    x FLOAT NOT NULL,
    y FLOAT NOT NULL
);

INSERT INTO coordinates (id, timestamp, x, y) VALUES (1, CURRENT_TIMESTAMP, 43.0, 3.0);
