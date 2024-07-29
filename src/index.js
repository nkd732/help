
const { Sequelize } = require('sequelize');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.host,
  dialect: 'mysql',
  logging: false,
});

sequelize.authenticate().then(() => {
  logger.info('Connected to MySQL');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
}).catch(err => {
  logger.error('Unable to connect to the database:', err);
  process.exit(1);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

