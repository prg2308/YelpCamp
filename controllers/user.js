const User = require('../models/user');
const Campground = require('../models/campground')
const getDate = require('../utilities/date')

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
        const { email, username, password, mobile } = req.body;
        const joinDate = getDate()
        const foundUser = await User.find({ email });
        if (foundUser.length) {
            req.flash('error', 'Email Already Exists!')
            return res.redirect('/register')
        }
        const user = new User({ email, username, mobile, joinDate })
        const regUser = await User.register(user, password)
        req.login(regUser, function (err) {
            if (err) {
                return next(err)
            }
            req.flash('success', `Welcome to Yelpcamp ${regUser.username}!`)
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', 'Username taken!')
        res.redirect('/register')
    }
}

module.exports.showUser = async (req, res) => {
    const { username } = req.params;
    const user = await User.find({ username })
    if (!user.length) {
        req.flash('error', 'No such user!')
        return res.redirect('/campgrounds')
    }
    const campgrounds = await Campground.find({ author: user[0]._id })
    res.render('users/show.ejs', { user: user[0], campgrounds })
}

module.exports.renderEdit = async (req, res) => {
    const { username } = req.params;
    const { passport } = req.session;
    if (passport && passport.user === username) {
        return res.send('OK to edit')
    }

    res.send('Invalid access')
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('warning', 'Logged out')
    res.redirect('/campgrounds')
}