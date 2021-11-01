const express = require('express');
const router = express.Router();
const passport = require('passport')

const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/user');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        catchAsync(users.login)
    )

router.get('/logout', users.logout)

router.get('/reset', users.reset)

module.exports = router
