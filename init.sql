CREATE TABLE coordinates (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    x FLOAT NOT NULL,
    y FLOAT NOT NULL
);

INSERT INTO coordinates (timestamp, x, y) VALUES (CURRENT_TIMESTAMP, 43.0, 3.0);
