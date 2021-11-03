const User = require('../models/user');
const Campground = require('../models/campground')
const getDate = require('../utilities/date');

module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs')
}

module.exports.renderLogin = (req, res) => {
    if (req.session.passport.user) {
        return res.redirect('/campgrounds')
    }
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
        const { email, username, password } = req.body;
        const joinDate = getDate()
        const foundUser = await User.find({ email });
        if (foundUser.length) {
            req.flash('error', 'Email Already Exists!')
            return res.redirect('/register')
        }
        const user = new User({ email, username, joinDate })
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

    const user = await User.find({ username })
    if (!user.length) {
        req.flash('error', 'No such user!')
        return res.redirect('/campgrounds')
    }

    if (!passport || passport.user !== username) {
        return res.redirect('/campgrounds')
    }

    res.render('users/edit.ejs', { user: user[0] })

}

module.exports.edit = async (req, res) => {
    const { passport } = req.session
    const user = passport.user
    const currentUser = await User.findOne({ username: user })
    const { email, username } = req.body;
    const foundUsers = await User.find({ $or: [{ username }, { email }] })
    let domain

    if (username === currentUser.username && email === currentUser.email) {
        req.flash('success', 'Updated Successfully!');
        return res.redirect(`/users/${user}`)
    }
    if (foundUsers.length) {
        for (const existingUser of foundUsers) {
            if (existingUser.username !== currentUser.username && existingUser.email !== currentUser.email) {
                existingUser.username === username ? (domain = 'Username') : (domain = 'Email');
                req.flash('error', `${domain} Already Exists!`);
                return res.redirect(`/users/${user}/edit`)
            }
        }
    }

    const filter = { username: user }
    const update = { username, email }

    const updated = await User.findOneAndUpdate(filter, update, {
        new: true
    });

    req.login(updated, function (err) {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Updated Successfully!');
        res.redirect(`/users/${updated.username}`)
    })

}

module.exports.delete = async (req, res) => {
    const { username } = req.params
    if (username !== req.session.passport.user) {
        res.redirect('/campgrounds')
    }
    const deleted = await User.deleteOne({ username })
    req.flash('warning', `Deleted user '${username}'`)
    res.redirect('/campgrounds')
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('warning', 'Logged out')
    res.redirect('/campgrounds')
}