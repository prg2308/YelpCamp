const mongoose = require('mongoose')
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    joinDate: {
        type: String,
        required: true
    },

    resetPasswordToken: String,
    resetPasswordExpires: String
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)