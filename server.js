const express = require('express')
const app = express()
const path = require('path')
const campgrounds = require('./router/campground')
const reviews = require('./router/reviews')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utilities/ExpressError.js')
const ejsMate = require('ejs-mate')
const sessionConfig = {
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to mongod')
    })
    .catch((err) => {
        console.log('Connection Error', err);
    })


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.engine('ejs', ejsMate)

app.use(session(sessionConfig))
app.use(flash())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.redirect('/campgrounds')
})

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
