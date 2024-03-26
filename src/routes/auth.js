const express = require('express');
const router = express.Router();
const authController = require('../controllers/signup');
const {verifyGatewayRequest} = require('../../../9-jobber-shared/src/gateway-middleware');



router.post('/signup',verifyGatewayRequest,authController.create);   

module.exports = router;