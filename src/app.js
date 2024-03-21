const { databaseConnection } = require('./database');
const { AuthServer } = require('./server');
const express = require('express');
const app = express();
const authserver = new AuthServer(app);

async function init() {
    databaseConnection();
    await authserver.start(app);
    return await authserver.authChannel;

}

let authChannel = init();

module.exports = {authChannel};



// console.log(authChannel);





