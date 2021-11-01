const Joi = require('joi')
const passwordValidator = require('password-validator');

module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
})

module.exports.userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(new RegExp('^[0-9]{10}$'))
})

const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8)
    .has().digits(1)

module.exports.passwordSchema = passwordSchema