const { Sequelize } = require('sequelize');
const config = require('./config');
const { winstonLogger } = require('../../9-jobber-shared/src/logger')

const log = winstonLogger('authServerDatabase', 'debug');

const sequelize = new Sequelize(config.MYSQL_DB, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        multipleStatements: true
    }
});

async function databaseConnection() {
    try {
        await sequelize.authenticate();
        log.info('AuthService Mysql database connection has been established successfully.')

    } catch (error) {
        log.error('Auth Service - Unable to connect to database.');
        log.log('error', 'AuthService databaseConnection() method error:', error);

    }
}

module.exports = { sequelize, databaseConnection };