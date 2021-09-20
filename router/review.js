const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utilities/catchAsync.js')
const { validateReview, isLoggedIn, isReviewAuth } = require('../utilities/middleware')
const reviews = require('../controllers/review')

router.post(
    '/',
    isLoggedIn,
    validateReview,
    catchAsync(reviews.create)
)

router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuth,
    catchAsync(reviews.delete)
)

module.exports = router
