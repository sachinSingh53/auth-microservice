const express = require('express');

const app = express();
const{start}  = require('./server');
const {setAuthChannel} = require('./services/auth-service');
const { databaseConnection } = require('./database');


async function init(){
    await databaseConnection();
   const authChannel = await start(app);

    setAuthChannel(authChannel);

    
}

init();

