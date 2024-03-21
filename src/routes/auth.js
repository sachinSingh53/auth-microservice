const express = require('express');
const router = express.Router();
const authController = require('../controllers/signup');
const verifyGatewayRequest = require('../middlewares/gateway');

// router.get('/health',(req,res)=>{
//     res.send('auth service is healthy');
// })

router.post('/signup',verifyGatewayRequest,authController.create);   

module.exports = router;