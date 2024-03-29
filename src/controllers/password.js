import{StatusCodes} from 'http-status-codes'
import { BadRequestError } from "../../../9-jobber-shared/src/errors.js";
import { authChannel } from "../app.js";
import config from "../config.js";
import { publishDirectMessage } from "../queues/auth.producer.js";
import { changePasswordSchema, emailSchema, passwordSchema } from "../schemes/password.js";
import { getAuthUserByPasswordToken, getUserByEmail, getUserByUsername, updatePassword, updatePasswordToken } from "../services/auth-service.js";
import crypto from 'crypto';


async function ForgotPassword(req,res){
    const {error} = emailSchema.validate(req.body);

    if (error) {
        throw new BadRequestError(error.details[0].message, 'password ForgotPassword() method error');
    }

    const {email} = req.body;

    const existingUser = await getUserByEmail(email);

    if(!existingUser){
        throw new BadRequestError('Invalid credentials','password ForgotPassword() method error');
    }

    const randomCharacters =  crypto.randomBytes(20).toString('hex');
    const date = new Date();

    date.setHours(date.getHours()+1);



    await updatePasswordToken(existingUser.dataValues.id,randomCharacters,date);

    const resetLink = `${config.CLIENT_URL}/reset_password?token=${randomCharacters}`;


    const messageDetails = {
        receiverEmail: existingUser.dataValues.email,
        resetLink,
        username: existingUser.dataValues.username,
        template: 'forgotPassword'
    }

    await publishDirectMessage(
        authChannel,
        'jobber-email-notification',
        'auth-email',
        JSON.stringify(messageDetails)
    )

    res.status(StatusCodes.OK).json({
        message: 'Password reset email sent.'
    })
}

async function resetPassword(req,res){
    const {error} = passwordSchema.validate(req.body);

    if (error) {
        throw new BadRequestError(error.details[0].message, 'password resetPassword() method error');
    }

    const { password,confirmPassword} = req.body;

    const {token} = req.params;

    // console.log(password,confirmPassword,token);

    if(password!==confirmPassword){
        throw new BadRequestError('Password does not match with confirm password','password resetPassword() method error');
    }

    const existingUser = await getAuthUserByPasswordToken(token);

    console.log(existingUser);

    if(!existingUser){
        throw new BadRequestError('reset token expired','password resetPassword() method error');
    }

    const hashedPassword = await existingUser.hashPassword(password);
    console.log(hashedPassword);

    await updatePassword(existingUser.dataValues.id,hashedPassword);

    const messageDetails = {
        receiverEmail: existingUser.dataValues.email,
        // resetLink,
        username: existingUser.dataValues.username,
        template: 'resetPasswordSuccess'
    }

    await publishDirectMessage(
        authChannel,
        'jobber-email-notification',
        'auth-email',
        JSON.stringify(messageDetails)
    )

    res.status(StatusCodes.OK).json({
        message: 'Password updated successfully'
    })
}


async function changePassword(req,res){
    const {error} = changePasswordSchema.validate(req.body);

    if (error) {
        throw new BadRequestError(error.details[0].message, 'password changePassword() method error, Joi Vailadition failed');
    }

    const { currentPassword,newPassword } = req.body;



    const existingUser = await getUserByUsername(`${req.currentUser.username}`);

    if(!existingUser){
        throw new BadRequestError('invalid password (please login again)','password changePassword() method error');
    }

    const hashedPassword = await existingUser.hashPassword(newPassword);

    await updatePassword(existingUser.dataValues.id,hashedPassword);

    const messageDetails = {
        receiverEmail: existingUser.dataValues.email,
        // resetLink,
        username: existingUser.dataValues.username,
        template: 'resetPasswordSuccess'
    }

    await publishDirectMessage(
        authChannel,
        'jobber-email-notification',
        'auth-email',
        JSON.stringify(messageDetails)
    )

    res.status(StatusCodes.OK).json({
        message: 'Password updated successfully'
    })
}


export {
    ForgotPassword,
    resetPassword,
    changePassword
}