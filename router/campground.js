const express = require('express')
const router = express.Router()
const multer = require('multer')
const { storage } = require('../config/cloudinary')
const upload = multer({ storage })

const catchAsync = require('../utilities/catchAsync.js')
const { isLoggedIn, validateCampground, isAuth } = require('../utilities/middleware')
const campgrounds = require('../controllers/campground')

router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(
    //     isLoggedIn,
    //     validateCampground,
    //     catchAsync(campgrounds.create)
    // )
    .post(upload.single('image'), (req, res) => {
        console.log(req.body, req.file)
        res.send('Worked')
    })//remove this post statement


router.get('/new', isLoggedIn, campgrounds.new)

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(
        isLoggedIn,
        isAuth,
        validateCampground,
        catchAsync(campgrounds.edit)
    )
    .delete(
        isLoggedIn,
        isAuth,
        catchAsync(campgrounds.delete)
    )

router.get(
    '/:id/edit',
    isLoggedIn,
    isAuth,
    catchAsync(campgrounds.renderEdit)
)

module.exports = router