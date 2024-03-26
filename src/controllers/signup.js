const config = require("../config");
const { publishDirectMessage } = require("../queues/auth.producer");
const signupSchema = require("../schemes/signup");
const { getUserByUsernameOrEmail, createUser, signToken } = require("../services/auth-service");
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes')
const { winstonLogger } = require('../../../9-jobber-shared/src/logger');
const { BadRequestError } = require('../../../9-jobber-shared/src/errors')

const log = winstonLogger('AuthController', 'debug');





module.exports.create = async (req, res) => {


    const { error } = signupSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message, 'SignUp create() method error');
    }
    // console.log(req.body); 
    const { username, password, email } = req.body;
    const checkIfUserExists = await getUserByUsernameOrEmail(username, email);
    // console.log(checkIfUserExists);
    if (checkIfUserExists) {
        throw new BadRequestError('Invalid credentials. Email or Username', 'SignUp create() method error');

    }

    const randomCharacters = crypto.randomBytes(20).toString('hex');

    const authData = {
        username: username.toString(),
        email: email.toString(),
        password,
        emailVerificationToken: randomCharacters
    }



    const result = await createUser(authData);

    // console.log(result);


    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;

    const messageDetails = {
        recieverEmail: email,
        verifyLink: verificationLink,
        template: 'verifyEmail'
    }

    // await publishDirectMessage
    //     (authChannel,
    //         'jobber-email-notification',
    //         'auth-email',
    //         JSON.stringify(messageDetails)
    //     );

    const userJWT = signToken(result.id, result.email, result.email);

    res.status(StatusCodes.CREATED).json({
        message: 'user created successfully',
        user: result,
        token: userJWT
    })




}