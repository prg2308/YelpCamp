const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utilities/catchAsync.js')
const Review = require('../models/review')
const Campground = require('../models/campground')
const { validateReview, isLoggedIn, isReviewAuth } = require('../utilities/middleware')

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Added Review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuth, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router
