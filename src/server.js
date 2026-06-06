import app from './app.js';
import sequelize from './config/database.js';
import env from './config/env.js';
import { initializeModels } from './models/index.js';

const startServer = async () => {
  try {
    initializeModels();

    await sequelize.authenticate();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
