const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const catchAsync = require('./utilities/catchAsync.js')
const ExpressError = require('./utilities/ExpressError.js')
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground')
const { campgroundSchema } = require('./utilities/schemas.js')

mongoose.connect('mongodb://localhost:27017/tentjet', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to mongod')
    })
    .catch((err) => {
        console.log('Connection Error', err);
    })


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

const validateCampground = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        throw new ExpressError(error.details[0].message, 400)
    } else {
        next()
    }

}

app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}))

app.get('/', (req, res) => {
    res.redirect('/campgrounds')
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ExpressError('Campground doesnt exist', 404)
    }
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show.ejs', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ExpressError('Campground doesnt exist', 404)
    }
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit.ejs', { campground })
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {

    const campground = new Campground(req.body)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) {
        err.message = 'Something went wrong'
    }
    res.status(statusCode).render('error.ejs', { err })
})

app.listen(3000, () => {
    console.log('Hosted on port 3000')
})
