import app, { testDatabaseConnection } from './app';
import logger from './utils/logger';

const PORT = +process.env.PORT! || 4000;

const startServer = async () => {
  await testDatabaseConnection();
  app.listen(PORT, '::', () => {
    logger.info(`Server running on []::]${PORT}`);
  });
};

startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
