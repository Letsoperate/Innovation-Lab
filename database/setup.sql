-- Innovation Lab Database Setup
-- Run this in DBeaver CE, pgAdmin 4, or psql

-- Create the database and user
CREATE DATABASE innovationlab;
CREATE USER innovationlab WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE innovationlab TO innovationlab;

-- Connect to the database and grant schema permissions
\c innovationlab
GRANT ALL ON SCHEMA public TO innovationlab;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO innovationlab;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO innovationlab;

-- Or for local development with existing postgres user:
-- CREATE DATABASE innovationlab;
-- \c innovationlab
-- Then set DATASOURCE_USER=postgres and DATASOURCE_PASSWORD=postgres in your .env
