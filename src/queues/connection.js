import config from '../config.js';
import amqp from 'amqplib';

async function createConnection() {
    const connection = await amqp.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel = await connection.createChannel();
    closeChannel(channel, connection);
    return channel;
}

function closeChannel(channel, connection) {
    process.once('SIGINT', async () => {
        await channel.close();
        await connection.close();
    })
}

export { createConnection };
