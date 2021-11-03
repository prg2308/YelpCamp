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
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet");

const campgroundRoutes = require('./router/campground')
const reviewRoutes = require('./router/review')
const userRoutes = require('./router/user')
const ExpressError = require('./utilities/ExpressError.js')
const User = require('./models/user.js')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const sessionConfig = {
    name: 'session',
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
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
app.use(helmet());

//Update scrpts and styles urls with bootstrap updates

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmal3lkc1/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl
    }
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.warning = req.flash('warning')
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



