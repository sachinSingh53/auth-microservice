const Joi = require('joi');

const loginSchema = Joi.object({
    //here we are assuming that user can login either via username or via email
    username:Joi.alternatives().conditional(Joi.string().email,{
        then: Joi.string().email().required(),
        otherwise:Joi.string().min(4).max(12).required()
    }),
    password:Joi.string().min(4).max(12).required()
});

module.exports = loginSchema;