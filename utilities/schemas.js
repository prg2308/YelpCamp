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

const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)

module.exports.passwordSchema = passwordSchema