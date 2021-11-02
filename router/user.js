const express = require('express');
const router = express.Router();
const passport = require('passport')

const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/user');
const { validateUser } = require('../utilities/middleware')

router.route('/register')
    .get(users.renderRegister)
    .post(
        validateUser,
        catchAsync(users.register)
    )

router.route('/login')
    .get(users.renderLogin)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        catchAsync(users.login)
    )

router.get('/users/:username', users.showUser)

router.get('/users/:username/edit', users.renderEdit)

router.get('/logout', users.logout)

module.exports = router
