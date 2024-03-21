require('dotenv').config()


class Config {
    constructor() {
        this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || ''
        this.JWT_TOKEN = process.env.JWT_TOKEN || ''
        this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || ''
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || ''
        this.MYSQL_DB = process.env.MYSQL_DB || ''
        this.CLIENT_URL = process.env.CLIENT_URL || ''
        // this.MYSQL_HOST = process.env.MYSQL_HOST || ''
        // this.MYSQL_USER = process.env.MYSQL_USER || ''
        // this.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || ''
        // this.MYSQL_PORT = process.env.MYSQL_PORT || 3306
    }
}

const config = new Config();

module.exports = config;