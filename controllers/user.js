const { equal } = require('joi');
const User = require('../models/user');
const { passwordSchema } = require('../utilities/schemas')

module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs')
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs')
}

module.exports.login = async (req, res) => {
    const { username } = req.body
    const user = await User.findOne({ username })
    req.flash('success', `Welcome back ${user.username}!`)
    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password, confPassword } = req.body;
        if (!passwordSchema.validate(password)) {
            req.flash('error', 'Invalid Password')
            return res.redirect('/register')
        }
        if (password !== confPassword) {
            req.flash('error', 'Passwords Dont Match!')
            return res.redirect('/register')
        }
        const foundUser = await User.find({ email });
        if (foundUser.length) {
            req.flash('error', 'Email Already Exists!')
            return res.redirect('/register')
        }
        const user = new User({ email, username })
        const regUser = await User.register(user, password)
        req.login(regUser, function (err) {
            if (err) {
                return next(err)
            }
            req.flash('success', `Welcome to Yelpcamp ${regUser.username}!`)
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', 'Username Taken!')
        res.redirect('/register')
    }
}

module.exports.reset = (req, res) => {
    const { passport } = req.session
    if (passport) {
        return res.redirect('/campgrounds')
    }

    res.send('Success!!')
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('warning', 'Logged out')
    res.redirect('/campgrounds')
}