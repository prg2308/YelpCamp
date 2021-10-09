const mongoose = require('mongoose');
const { Schema } = mongoose;
const opts = { toJSON: { virtuals: true } };

const { cloudinary } = require('../config/cloudinary')
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300/h_225')
})

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [ImageSchema],
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

campgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `<img src="${this.images[0].url}" style="width:100%;height:100%"><strong><a href="/campgrounds/${this._id}" style="text-decoration:none;">${this.title}</a></strong>`
})

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        await Review.deleteMany({
            _id: {
                $in: campground.reviews
            }
        })
    }

    if (campground.images) {
        for (const img of campground.images) {
            if (img.filename !== 'YelpCamp/sample_cwp8tg') {
                await cloudinary.uploader.destroy(img.filename);
            }
        }
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)