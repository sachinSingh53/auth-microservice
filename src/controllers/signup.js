const config = require("../config");
const { publishDirectMessage } = require("../queues/auth.producer");
const signupSchema = require("../schemes/signup");

const { getUserByUsernameOrEmail, createUser, signToken } = require("../services/auth-service");
const crypto = require('crypto');




module.exports.create = async (req, res) => {
    try {

        const { error } = signupSchema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        // console.log(req.body); 




        const { username, password, email } = req.body;

        const checkIfUserExists = await getUserByUsernameOrEmail(username, email);
        // console.log(checkIfUserExists);
        if (checkIfUserExists) {
            console.log('user already exixts ')
            throw new Error('user already exists');
        }

        const randomCharacters = crypto.randomBytes(20).toString('hex');

        const authData = {
            username: username.toString(),
            email: email.toString(),
            password,
            emailVerificationToken: randomCharacters
        }

        console.log(authData);

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

        res.status(200).json({
            message: 'user created successfully',
            user: result,
            token: userJWT
        })


    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }

}