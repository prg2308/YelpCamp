const express = require('express')
const router = express.Router()

const catchAsync = require('../utilities/catchAsync.js')
const { isLoggedIn, validateCampground, isAuth } = require('../utilities/middleware')
const campgrounds = require('../controllers/campground')

router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.new)

router.get('/:id', catchAsync(campgrounds.show))

router.get(
    '/:id/edit',
    isLoggedIn,
    isAuth,
    catchAsync(campgrounds.renderEdit)
)

router.post(
    '/',
    isLoggedIn,
    validateCampground,
    catchAsync(campgrounds.create)
)

router.put(
    '/:id',
    isLoggedIn,
    isAuth,
    validateCampground,
    catchAsync(campgrounds.edit)
)

router.delete(
    '/:id',
    isLoggedIn,
    isAuth,
    catchAsync(campgrounds.delete)
)

module.exports = router