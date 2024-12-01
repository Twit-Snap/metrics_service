import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { DatabasePool } from './repository/db';
import metricRoutes from './routes/routes';
import { errorHandler } from './middleware/errorHandler';
import { logMiddleware } from './middleware/logMiddleware';

export function initializeEnvironment() {
  // Determine environment
  const env = process.env.NODE_ENV || 'development';
  const envFilePath =
    env === 'development'
      ? path.resolve(__dirname, '../.env.dev')
      : path.resolve(__dirname, '../.env');

  // Overload environment variables
  dotenv.config({ path: envFilePath });

  // Debug environment variables
  const debugEnvVars = {
    NODE_ENV: env,
    DATABASE_URL: env === 'development' ? process.env.DATABASE_URL : 'url its a secret... shhh'
  };
  console.log('envFilePath:', envFilePath);
  console.log('Environment variables: ', debugEnvVars);
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const cors = require('cors');
const app = express();

// Function to test the database connection
export async function testDatabaseConnection(retries = 5, delay = 5000) {
  while (retries > 0) {
    try {
      const pool = DatabasePool.getInstance();
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      console.log('Successfully connected to the database');
      return;
    } catch (err) {
      console.error(`Failed to connect to the database. Retries left: ${retries}`, err);
      retries--;
      if (retries === 0) {
        console.error('Max retries reached. Exiting.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

initializeEnvironment();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logMiddleware);

// Routes
app.use('/metrics', metricRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await DatabasePool.closePool();
  process.exit(0);
});

export default app;
