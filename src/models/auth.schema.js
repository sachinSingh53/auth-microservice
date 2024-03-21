const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const bcrypt = require('bcryptjs');
const SALT_ROUND = 10;


const AuthModel = sequelize.define('auths', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetExpires: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Date.now
    }
},{
    indexes:[
        {
            unique: true,
            fields:['email']
        },
        {
            unique: true,
            fields:['username']
        },
        {
            unique: true,
            fields:['emailVerificationToken']
        }
    ]
});

AuthModel.addHook('beforeCreate', async(auth)=>{
    const hashedPassword = await bcrypt.hash(auth.dataValues.password,SALT_ROUND);
    auth.dataValues.password = hashedPassword;
})

AuthModel.prototype.comparePassword = async function(password,hashedPassword){
    return await bcrypt.compare(password,hashedPassword);
}

// force:true --> this will delete the table whenever the server gets restarted
AuthModel.sync({});

module.exports = {AuthModel}