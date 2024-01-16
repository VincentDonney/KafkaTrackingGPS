-- Connect to the 'pg' database
\connect pg;

-- Create the 'coordinates' table
CREATE TABLE coordinates (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    x REAL NOT NULL,
    y REAL NOT NULL
);

-- Insert data into the 'coordinates' table
INSERT INTO coordinates (id, timestamp, x, y) VALUES (1, CURRENT_TIMESTAMP, 43.0, 3.0);
