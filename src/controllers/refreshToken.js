
import { StatusCodes } from 'http-status-codes';
import{getUserByUsername, signToken} from '../services/auth-service.js'

export async function token(req,res){
    const existingUser = await getUserByUsername(req.params.username);
    const userJwt = signToken(existingUser.dataValues.id,existingUser.dataValues.email,existingUser.dataValues.username);
    res.status(StatusCodes.OK).json({
        message: 'refresh token',
        user: existingUser,
        refreshToken: userJwt
    })
}