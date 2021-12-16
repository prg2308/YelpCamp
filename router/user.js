const express = require('express');
const router = express.Router();
const passport = require('passport')
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto')

const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/user');
const { validateUser, validateUpdate } = require('../utilities/middleware')

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
    console.log(token);
    res.send('cool')
}))


// router.post('/reset', function (req, res, next) {
//     async.waterfall([
//         function (done) {
//             crypto.randomBytes(20, function (err, buf) {
//                 var token = buf.toString('hex');
//                 done(err, token);
//             });
//         },
//         function (token, done) {
//             User.findOne({ email: req.body.email }, function (err, user) {
//                 if (!user) {
//                     req.flash('error', 'No account with that email address exists.');
//                     return res.redirect('/forgot');
//                 }

//                 user.resetPasswordToken = token;
//                 user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//                 user.save(function (err) {
//                     done(err, token, user);
//                 });
//             });
//         },
//         function (token, user, done) {
//             var smtpTransport = nodemailer.createTransport({
//                 service: 'Gmail',
//                 auth: {
//                     user: 'learntocodeinfo@gmail.com',
//                     pass: process.env.GMAILPW
//                 }
//             });
//             var mailOptions = {
//                 to: user.email,
//                 from: 'learntocodeinfo@gmail.com',
//                 subject: 'Node.js Password Reset',
//                 text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//                     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//                     'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//                     'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//             };
//             smtpTransport.sendMail(mailOptions, function (err) {
//                 console.log('mail sent');
//                 req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
//                 done(err, 'done');
//             });
//         }
//     ], function (err) {
//         if (err) return next(err);
//         res.redirect('/reset');
//     });
// });


module.exports = router
