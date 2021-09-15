const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const catchAsync = require('../utilities/catchAsync.js')
const ExpressError = require('../utilities/ExpressError.js')
const { campgroundSchema } = require('../utilities/schemas.js')
const Campground = require('../models/campground')

const validateCampground = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        throw new ExpressError(error.details[0].message, 400)
    } else {
        next()
    }

}

router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ExpressError('Campground doesnt exist', 404)
    }
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if (!campground) {
        req.flash('error', 'Cannot find Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ExpressError('Campground doesnt exist', 404)
    }
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find Campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit.ejs', { campground })
}))

router.post('/', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body)
    await campground.save();
    req.flash('success', 'Created new Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
    req.flash('success', 'Edited Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', `Deleted ${campground.title}`)
    res.redirect('/campgrounds')
}))

module.exports = router