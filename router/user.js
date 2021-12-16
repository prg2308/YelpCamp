const express = require('express');
const router = express.Router();
const passport = require('passport')

const User = require('../models/user')
const { passwordSchema } = require('../utilities/schemas')

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

router.get('/reset/:token', catchAsync(async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    if (!user) {
        req.flash('error', 'Password Reset Token is invalid or has expired! Please try again')
        return res.redirect('/reset')
    }
    res.render('users/setNew', { token, user })
}))

router.post('/reset/:token', validatePassword, catchAsync(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
    if (!user) {
        req.flash('error', 'Password Reset Token is invalid or has expired! Please try again')
        return res.redirect('/reset')
    }

    await user.setPassword(password)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    req.login(user, function (err) {
        if (err) {
            next(err);
        }
    })

    req.flash('success', 'Password Updated Successfully')
    res.redirect(`/users/${user.username}`)


}))

module.exports = router
