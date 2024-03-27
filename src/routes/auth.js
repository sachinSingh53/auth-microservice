import express from 'express';
import { create } from '../controllers/signup.js';
import { verifyGatewayRequest } from '../../../9-jobber-shared/src/gateway-middleware.js';
import { authChannel } from '../app.js';
import { read } from '../controllers/signin.js';
import { update } from '../controllers/verifyEmail.js';
const router = express.Router();
// router.get('/check')

router.post('/signup', verifyGatewayRequest, create);   
router.post('/signin', verifyGatewayRequest, read);   
router.put('/verify-email', verifyGatewayRequest, update);   
// router.post('/signup', create);   

export default router;
