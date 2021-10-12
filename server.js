const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const LocalStrategy = require('passport-local')
const ejsMate = require('ejs-mate')

const campgroundRoutes = require('./router/campground')
const reviewRoutes = require('./router/review')
const userRoutes = require('./router/user')
const ExpressError = require('./utilities/ExpressError.js')
const User = require('./models/user.js')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

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

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl
    }
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.returnTo = req.originalUrl
    next();
})

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

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



