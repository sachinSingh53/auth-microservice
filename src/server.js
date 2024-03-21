const config = require('./config');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const { createConnection } = require('./queues/connection');
const authRoutes = require('./routes/auth');




class AuthServer{

    constructor(app){
        this.app = app;
        this.authChannel='gaurang'
    }

    async start(){
        this.#securityMiddleware(this.app);
        this.#standardMiddleware(this.app);
        this.#routesMiddleware(this.app);
        this.#startQueues();
        this.#startServer(this.app);
    }


    #securityMiddleware(app){
        app.set('trust proxy',1);
        app.use(cors({
            origin: config.API_GATEWAY_URL,
            credentials:true,
            methods:['GET','POST','PUT','DELETE', 'OPTIONS']
        }))
        

        app.use((req,_res,next)=>{
            if(req.headers.authorization){
                const token = req.headers.authorization.split(' ')[1];
                const payload = jwt.verify(token,config.JWT_TOKEN);
                req.currentUser = payload;
            }
            next();
        })

    }


    #standardMiddleware(app){
        app.use(compression());
        app.use(bodyParser.json({limit: '200mb'}));
        app.use(bodyParser.urlencoded({extended:true,limit: '200mb'}));


    }


    #routesMiddleware(app){
        app.use('/api/v1/auth',authRoutes);

    }
    

    async #startQueues(){
       this.authChannel = await createConnection();
    }

    
    #startServer(app){
        try{
            const SERVER_PORT = 4002
            app.listen(SERVER_PORT,()=>{
                console.log(`Auth server is listening on ${SERVER_PORT}`);
            })

        }catch(err){
            console.log(err);
        }

    } 

}

module.exports = {AuthServer};