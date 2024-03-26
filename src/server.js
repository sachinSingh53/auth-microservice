require('express-async-errors');
const config = require('./config');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const { createConnection } = require('./queues/connection');
const authRoutes = require('./routes/auth');
const { winstonLogger } = require('../../9-jobber-shared/src/logger')
const { CustomError, BadRequestError } = require('../../9-jobber-shared/src/errors');

const log = winstonLogger('authServer', 'debug');

function securityMiddleware(app) {
    app.set('trust proxy', 1);
    app.use(cors({
        origin: config.API_GATEWAY_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }));

    app.use((req, _res, next) => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, config.JWT_TOKEN);
            req.currentUser = payload;
        }
        next();
    });


}

function standardMiddleware(app) {
    app.use(compression());
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));


}

function routesMiddleware(app) {
    app.get('/catch',async(req,res)=>{
        try{
            throw new BadRequestError('dsksdhksd','dssdsdsddsds')
        }catch(err){
            throw new BadRequestError(err);
        }
        
    })
    app.use('/api/v1/auth', authRoutes);
}

async function startQueues() {
    try {
        const authChannel = await createConnection();

        return authChannel;



    } catch (error) {

        log.error('error in startQueues() in server.js ', error, '');
        throw new AsyncAPIError(error);
    }
}

function startServer(app) {
    try {
        const SERVER_PORT = 4002;
        app.listen(SERVER_PORT, () => {
            log.info(`Auth server is listening on ${SERVER_PORT}`);
        });

    } catch (err) {
        log.error('error in startServer(): ', err, '');
        // throw new APIError(err);
    }
}
function errorHandler(app) {
    

    app.use((err, req, res,next) => {
        log.log('error', `AuthService ${err.comingFrom}`, err);
        if (err instanceof CustomError) {
            res.status(err.statusCode).json(err.serializeErrors());
        }
        next();
    })

}

async function start(app) {

    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    // console.log('in 1')
    const channel = await startQueues();

    errorHandler(app);
    startServer(app);


    return channel

}


module.exports = {
    start,
}



