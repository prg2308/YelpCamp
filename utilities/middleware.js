const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')

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

module.exports.isAuth = async function (req, res, next) {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find Campground!')
        return res.redirect('/campgrounds')
    }
    if (!campground.author.equals(req.user._id)) {
        return res.redirect(`/campgrounds/${id}`)
    }

    next()
}

module.exports.isReviewAuth = async function (req, res, next) {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        return res.redirect(`/campgrounds/${id}`)
    }

    next()
}
