const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Review', reviewSchema)