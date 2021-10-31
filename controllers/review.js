const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.create = async (req, res) => {
    let total = 0;
    const campground = await Campground.findById(req.params.id).populate('reviews')
    const review = new Review(req.body)
    review.author = req.user._id
    campground.reviews.push(review)
    for (rev of campground.reviews) {
        total += parseInt(rev.rating)
    }
    campground.avgRating = Math.floor(total / (campground.reviews.length))
    await review.save()
    await campground.save()
    req.flash('success', 'Added Review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('warning', 'Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}