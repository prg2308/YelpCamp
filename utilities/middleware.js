const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./ExpressError')

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        throw new ExpressError(error.details[0].message, 400)
    } else {
        next()
    }

}

module.exports.validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        throw new ExpressError(error.details[0].message, 400)
    } else {
        next()
    }
}