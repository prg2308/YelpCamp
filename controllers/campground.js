const mongoose = require('mongoose')
const getDate = require('../utilities/date')
const { cloudinary } = require('../config/cloudinary')
const ExpressError = require('../utilities/ExpressError')
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const { mapboxToken } = require('../config/env')
const campground = require('../models/campground')
const geoCoder = mbxGeocoding({ accessToken: mapboxToken })

module.exports.index = async (req, res, next) => {
    let campgrounds, allCamps, text
    let { search, sort } = req.query

    const { page = '1' } = req.query
    if (page < 1) {
        return res.redirect('/campgrounds')
    }
    const startIndex = (page - 1) * 6
    const endIndex = page * 6
    if (search) {
        search = search.toLowerCase();
        allCamps = await campground.find({ title: { $regex: '.*' + search + '.*' } }).populate('reviews')
        campgrounds = await campground.find({ title: { $regex: '.*' + search + '.*' } }).skip(startIndex).limit(6).populate('reviews').sort({
            timestamp: 'desc'
        })
        if (sort) {
            switch (sort) {
                case 'date':
                    campgrounds = await campground.find({ title: { $regex: '.*' + search + '.*' } }).skip(startIndex).limit(6).populate('reviews').sort({
                        timestamp: 'desc'
                    })
                    break;
                case 'pa':
                    campgrounds = await campground.find({ title: { $regex: '.*' + search + '.*' } }).skip(startIndex).limit(6).populate('reviews').sort({
                        price: 'asc'
                    })
                    break;
                case 'pd':
                    campgrounds = await campground.find({ title: { $regex: '.*' + search + '.*' } }).skip(startIndex).limit(6).populate('reviews').sort({
                        price: 'desc'
                    })
                    break;
                case 'ra':
                    campgrounds = await campground.find({ title: { $regex: '.*' + search + '.*' } }).skip(startIndex).limit(6).populate('reviews').sort({
                        avgRating: 'desc'
                    })
                    break;
                case 'rd':
                    campgrounds = await campground.find({ title: { $regex: '.*' + search + '.*' } }).skip(startIndex).limit(6).populate('reviews').sort({
                        avgRating: 'asc'
                    })
                    break;
                default:
                    return res.redirect('/campgrounds')
            }
        }
        if (allCamps.length) {
            text = `Search results for "${search}"`
        } else {
            text = `No results :(`
        }
    } else {
        allCamps = await Campground.find();
        campgrounds = await campground.find({}).skip(startIndex).limit(6).populate('reviews').sort({
            timestamp: 'desc'
        })
        if (sort) {
            switch (sort) {
                case 'date':
                    campgrounds = await campground.find({}).skip(startIndex).limit(6).populate('reviews').sort({
                        timestamp: 'desc'
                    })
                    break;
                case 'pa':
                    campgrounds = await campground.find({}).skip(startIndex).limit(6).populate('reviews').sort({
                        price: 'asc'
                    })
                    break;
                case 'pd':
                    campgrounds = await campground.find({}).skip(startIndex).limit(6).populate('reviews').sort({
                        price: 'desc'
                    })
                    break;
                case 'ra':
                    campgrounds = await campground.find({}).skip(startIndex).limit(6).populate('reviews').sort({
                        avgRating: 'desc'
                    })
                    break;
                case 'rd':
                    campgrounds = await campground.find({}).skip(startIndex).limit(6).populate('reviews').sort({
                        avgRating: 'asc'
                    })
                    break;
                default:
                    return res.redirect('/campgrounds')
            }
        }

        text = "All Campgrounds"
    }
    res.render('campgrounds/index.ejs', { campgrounds, allCamps, page, search, sort, text, })
}

module.exports.new = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in!')
        return res.redirect('/login')
    }
    res.render('campgrounds/new')
}

module.exports.show = async (req, res, next) => {
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
}

module.exports.renderEdit = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ExpressError('Page not found', 404)
    }
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit.ejs', { campground })
}

module.exports.create = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body)
    if (!req.files) {
        throw new ExpressError('Images are required', 400)
    }
    const date = getDate()
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    campground.geometry = geoData.body.features[0].geometry
    campground.createDate = date;
    await campground.save();
    req.flash('success', 'Created new Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.edit = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
    campground.geometry = geoData.body.features[0].geometry
    if (!req.files) {
        throw new ExpressError('Images are required', 400)
    }
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save()
    req.flash('success', 'Edited Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', `Deleted ${campground.title}`)
    res.redirect('/campgrounds')
}