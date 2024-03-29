import { isEmail } from '../../../9-jobber-shared/src/helper.js';
import {loginSchema} from '../schemes/login.js'
import { getUserByEmail, getUserByUsername, signToken } from '../services/auth-service.js';
import {BadRequestError} from '../../../9-jobber-shared/src/errors.js';
import { winstonLogger } from '../../../9-jobber-shared/src/logger.js';
import { StatusCodes } from 'http-status-codes';
const log = winstonLogger('signIn controller','debug');

export const read = async(req,res)=>{

    const { error } = loginSchema.validate(req.body)
    if (error) {
        throw new BadRequestError(error.details[0].message, 'signIn read() method error');
    }
    const {username, password} = req.body;
    let existingUser;
    if(!isEmail(username)){
        existingUser = await getUserByUsername(username);
    }
    else{
        existingUser = await getUserByEmail(username);
    }


    if(!existingUser){
        throw new BadRequestError('Invalid Cradentials','signIn read() method error');
    }

    const passwordMatch = await existingUser.comparePassword(password,existingUser.dataValues.password);
    
    if(!passwordMatch){
        throw new BadRequestError('Invalid Cradentials','signIn read() method error');
    }
    const userJwt = signToken(existingUser.id,existingUser.email,existingUser.username);

    const userData = { ...existingUser.dataValues };
    delete userData.password;
    res.status(StatusCodes.OK).json({
        message:'login successfully',
        user: userData,
        token: userJwt
    })
}