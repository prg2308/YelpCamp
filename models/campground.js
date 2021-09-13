const { number } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: [

    ]
})

module.exports = mongoose.model('Campground', campgroundSchema)