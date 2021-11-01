const User = require('../models/user');

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
        const foundUser = await User.find({ email });
        if (foundUser.length) {
            req.flash('error', 'Email Already Exists!')
            return res.redirect('/register')
        }
        const user = new User({ email, username, mobile })
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

    res.render('users/show.ejs', { user: user[0] })
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('warning', 'Logged out')
    res.redirect('/campgrounds')
}