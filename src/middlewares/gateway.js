const jwt = require('jsonwebtoken');
const config = require('../config');

const tokens = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

function verifyGatewayRequest(req, res, next) {
    if (!req.headers.gatewaytoken) {
        throw new Error('request coming from invalid source');
    }

    const token = req.headers.gatewaytoken;

    if (!token) {
        throw new Error('request coming from invalid source');
    }

    try {
        const payload = jwt.verify(token, `${config.GATEWAY_JWT_TOKEN}`);
        if (!tokens.includes(payload.id)) {
            throw new Error('request coming from invalid source');
        }
    } catch (err) {
        throw new Error('request coming from invalid source');
    }

    next();
}

module.exports = verifyGatewayRequest;
