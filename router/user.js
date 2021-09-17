const express = require('express');
const router = express.Router();
const passport = require('passport')

const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user');
const { findOne } = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register.ejs')
})

router.get('/login', (req, res) => {
    res.render('users/login.ejs')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {
    const { username } = req.body
    const user = await User.findOne({ username })
    req.flash('success', `Welcome back ${user.username}!`)
    res.redirect('/campgrounds')
}))

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const regUser = await User.register(user, password)
        req.flash('success', `Welcome to Yelpcamp ${regUser.username}!`)
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', 'Username is already taken !')
        res.redirect('/register')
    }
}))

module.exports = router


// router.get('/validate', catchAsync(async (req, res) => {
//     const { username } = req.query;
//     const foundUser = await User.findOne({ username })
//     if (foundUser) {
//         return res.send(true)
//     }
//     res.send(false)
// }))          

//API TO CHECK VALIDITY OF USERNAME