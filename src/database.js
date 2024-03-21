const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.MYSQL_DB,{
    dialect:'mysql',
    logging: false,
    dialectOptions:{
        multipleStatements:true
    }
});

async function databaseConnection(){
    try {
        await sequelize.authenticate();
        console.log('Auth-service database connected')

    } catch (error) {
        console.log('database connection error',error);
    }
}

module.exports = {sequelize,databaseConnection};