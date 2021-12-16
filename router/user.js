const express = require('express');
const router = express.Router();
const passport = require('passport')

const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/user');
const { validateUser, validateUpdate, validatePassword } = require('../utilities/middleware')


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

router.route('/users/:username')
    .get(users.showUser)
    .post(
        validateUpdate,
        catchAsync(users.edit)
    )
    .delete(catchAsync(users.delete))

router.get('/users/:username/edit', users.renderEdit)

router.get('/logout', users.logout)

router.route('/reset')
    .get(users.renderReset)
    .post(catchAsync(users.reset))

router.route('/reset/:token')
    .get(catchAsync(users.renderSetNew))
    .post(
        validatePassword,
        catchAsync(users.setNew)
    )

module.exports = router
