import express from 'express';
import { verifyGatewayRequest } from '../../../9-jobber-shared/src/gateway-middleware.js';
import { read, resendEmail } from '../controllers/current-user.js';
import { token } from '../controllers/refreshToken.js';
const router = express.Router();
// router.get('/check')

router.get('/refresh-token/:username',verifyGatewayRequest,token);
router.get('/currentuser',verifyGatewayRequest,read);
router.post('/resend-email',verifyGatewayRequest,resendEmail);


export default router;
