-- Connect to the 'pg' database
\connect pg;

-- Create the 'coordinates' table
CREATE TABLE coordinates (
    id integer NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    x REAL NOT NULL,
    y REAL NOT NULL
);