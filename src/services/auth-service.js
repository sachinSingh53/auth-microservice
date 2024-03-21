const jwt = require("jsonwebtoken");
const { AuthModel } = require("../models/auth.schema");
const { publishDirectMessage } = require("../queues/auth.producer");
const {Op} = require('sequelize');
const config = require("../config");



async function createUser(data){
    const result = await AuthModel.create(data);
    const messageDetails = {
        username: result.dataValues.username,
        email: result.dataValues.email,
        createdAt:result.dataValues.createdAt,
        type:'auth'
    };


    // await publishDirectMessage(
    //     authChannel,
    //     'jobber-buyer-updates',
    //     'user-buyer',
    //     JSON.stringify(messageDetails)
    // );
    return result;
}

async function getUserById(authId){
   const user = await AuthModel.findOne({
        where:{id:authId},
        attributes:{
            exclude:['password']
        }
    })

    return user;
}

async function getUserByUsernameOrEmail(username,email){
    const user = await AuthModel.findOne({
        where:{
            [Op.or]:[{username: username},{email: email}]
        }
    })

    return user;
}

async function getUserByUsername(username){
    const user = await AuthModel.findOne({
        where:{username: username.toLowerCase()},
        attributes:{
            exclude:['password']
        }
    })

    return user;
}
async function getUserByEmail(email){
    const user = await AuthModel.findOne({
        where:{email: email.toLowerCase()},
        attributes:{
            exclude:['password']
        }
    })

    return user;
}
async function getUserByVerificationToken(token){
    const user = await AuthModel.findOne({
        where:{emailVerificationToken: token},
        attributes:{
            exclude:['password']
        }
    })

    return user;
}

async function getAuthUserByPasswordToken(token){
    const user = await AuthModel.findOne({
        where:{
            [Op.and]: [{passwordResetToken:token},{passwordResetExpires:{[Op.gt]: new Date()}}]
        }
    })
}

async function updateVerifyEmailField(authId,token,emailVerified){
    await AuthModel.update(
        {
            emailVerified: emailVerified,
            emailVerificationToken: token
        },
        {
            where:{id:authId}
        }
    );
}

async function updatePasswordToken(authId,token,tokenExpiration){
    await AuthModel.update(
        {
            passwordResetToken: token,
            passwordResetExpires: tokenExpiration
        },
        {
            where:{id:authId}
        }
    );
}
async function updatePassword(authId,password){
    await AuthModel.update(
        {
            password,
            passwordResetToken:'',
            passwordResetExpires: new Date()
        },
        {
            where:{id:authId}
        }
    );
}

function signToken(id,email,username){
    return jwt.sign(
        {
            id,
            email,
            username
        },
        config.JWT_TOKEN
    )
}

module.exports = {
    createUser,
    getUserById,
    getUserByUsernameOrEmail,
    getUserByUsername,
    getUserByEmail,
    getUserByVerificationToken,
    getAuthUserByPasswordToken,
    updateVerifyEmailField,
    updatePasswordToken,
    updatePassword,
    signToken
}


