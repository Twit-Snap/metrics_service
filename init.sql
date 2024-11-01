-- Connect to the default 'postgres' database
\c postgres;

-- Check if the database exists, if not, create it
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'twitter_metrics') THEN
      CREATE DATABASE twitter_metrics;

   END IF;
END
$do$;

-- Connect to the twitter_metrics database
\c twitter_metrics;

-- Create the metrics table if it doesn't exist
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    type VARCHAR(50) NOT NULL,
    user VARCHAR(50) NOT NULL,
    metrics JSONB NOT NULL
);

