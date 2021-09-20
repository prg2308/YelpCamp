const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const ExpressError = require('../utilities/ExpressError')
const catchAsync = require('../utilities/catchAsync.js')
const Campground = require('../models/campground')
const { isLoggedIn, validateCampground, isAuth } = require('../utilities/middleware')

router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login')
    }
    res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ExpressError('Page not found', 404)
    }
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', { campground })
}))

router.get('/:id/edit', isLoggedIn, isAuth, catchAsync(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ExpressError('Page not found', 404)
    }
    res.render('campgrounds/edit.ejs', { campground })
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body)
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Created new Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/:id', isLoggedIn, isAuth, validateCampground, catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body)
    req.flash('success', 'Edited Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuth, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', `Deleted ${campground.title}`)
    res.redirect('/campgrounds')
}))

module.exports = router