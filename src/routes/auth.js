import express from 'express';
import { create } from '../controllers/signup.js';
import { verifyGatewayRequest } from '../../../9-jobber-shared/src/gateway-middleware.js';

const router = express.Router();

import { authChannel } from '../app.js';

// router.get('/check')

router.post('/signup', verifyGatewayRequest, create);   
// router.post('/signup', create);   

export default router;
