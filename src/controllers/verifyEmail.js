import { BadRequestError } from "../../../9-jobber-shared/src/errors.js";
import { getUserById, getUserByVerificationToken, updateVerifyEmailField } from "../services/auth-service.js";
import{StatusCodes} from 'http-status-codes'


export const update = async (req,res)=>{
    const {token} = req.body;
    
    const checkifUserexist = await getUserByVerificationToken(token);

    if(!checkifUserexist){
        throw new BadRequestError('verification token is either invalid or already being used','VerifyEmail update() method');
    }

    await updateVerifyEmailField(checkifUserexist.dataValues.id,'',1);

    const updatedUser = await getUserById(checkifUserexist.dataValues.id);

    res.status(StatusCodes.OK).json({
        message:'Email verified successfully',
        user: updatedUser
    })
}