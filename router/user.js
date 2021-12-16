const express = require('express');
const router = express.Router();
const passport = require('passport')
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')

const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')
const User = require('../models/user')
const users = require('../controllers/user');
const { validateUser, validateUpdate } = require('../utilities/middleware')
const { sendgridKey } = require('../config/env')

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

router.get('/reset', (req, res) => {
    res.render('users/reset')
})

router.post('/reset', catchAsync(async (req, res) => {

    const buf = await crypto.randomBytes(20);
    const token = buf.toString('hex')

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        req.flash('error', 'No account with that email exists')
        return res.redirect('/reset')
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000
    await user.save()

    sgMail.setApiKey(sendgridKey)
    const msg = {
        to: user.email,
        from: 'yelpcamp@hotmail.com',
        subject: 'YelpCamp Password Reset',
        text: 'Click the link to change your password. If this was not you, ignore this email',
        html: ` <strong>${user.username},</strong>
                <p>Someone (Hopefully you) has requested a password reset. </p>
                <p><a href="prgyelp.herokuapp.com/reset/${token}">Click Here</a> to reset your YelpCamp password</p>
                <br>
                <p>If this was not you, please ignore this email</p>
                <hr>
                <i>This link will expire in one hour</i> `
    }

    await sgMail.send(msg);
    req.flash('success', 'Email sent, Check your inbox for further instructions.');
    res.redirect('/reset')
}))

module.exports = router
