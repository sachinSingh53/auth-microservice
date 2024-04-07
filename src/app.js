import express from 'express';
import { start } from './server.js';
import { databaseConnection } from './database.js';

const app = express();

async function init() {
    await databaseConnection();

   const Channel = await start(app);
    return Channel;
}

const authChannel = await init();


export {authChannel};
