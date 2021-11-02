const mongoose = require('mongoose')
const cities = require('./cities.js')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')
const getDate = require('../utilities/date')

mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to mongod')
    })
    .catch((err) => {
        console.log('Connection Error', err);
    })

const randArray = function (array) {
    return array[Math.floor(Math.random() * array.length)]
}

const imgArr = [
    {
        url: 'https://res.cloudinary.com/dmal3lkc1/image/upload/v1635773509/YelpCamp/ja6tjse2luikkzp6k8ha.jpg',
        filename: 'YelpCamp/ja6tjse2luikkzp6k8ha',
    },
    {
        url: 'https://res.cloudinary.com/dmal3lkc1/image/upload/v1635773508/YelpCamp/f3bdefps8lmgbzj7hreu.jpg',
        filename: 'YelpCamp/f3bdefps8lmgbzj7hreu',
    },
    {
        url: 'https://res.cloudinary.com/dmal3lkc1/image/upload/v1635773507/YelpCamp/ms24ie1om79hoi6srjfp.jpg',
        filename: 'YelpCamp/ms24ie1om79hoi6srjfp',
    },
    {
        url: 'https://res.cloudinary.com/dmal3lkc1/image/upload/v1635773389/YelpCamp/mguk5fuuq6bjrm0vwtf0.jpg',
        filename: 'YelpCamp/mguk5fuuq6bjrm0vwtf0',
    },
    {
        url: 'https://res.cloudinary.com/dmal3lkc1/image/upload/v1635773389/YelpCamp/dqkg0dwglguxjvjudd1w.jpg',
        filename: 'YelpCamp/dqkg0dwglguxjvjudd1w',
    },
    {
        url: 'https://res.cloudinary.com/dmal3lkc1/image/upload/v1635773389/YelpCamp/qfvtjkyuhmsfzxvebkjv.jpg',
        filename: 'YelpCamp/qfvtjkyuhmsfzxvebkjv',
    }
]

async function seedDB() {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const randomNo = Math.floor(Math.random() * 769)
        const price = Math.floor(Math.random() * 2000) + 500
        const avgRating = Math.floor(Math.random() * 5) + 1
        const date = getDate()
        const randImg = []
        for (let i = 0; i < 3; i++) {
            randImg[i] = Math.floor(Math.random() * 6)
        }
        const camp = new Campground({
            author: '61803a50d6f70deb45690446',
            title: `${randArray(descriptors)} ${randArray(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[randomNo].lng,
                    cities[randomNo].lat
                ]
            },
            images: [
                imgArr[randImg[0]],
                imgArr[randImg[1]],
                imgArr[randImg[2]],
            ],
            price,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut nemo totam, doloribus iusto architecto consequatur quo quia! Amet perferendis quia molestiae consequatur sapiente ducimus illo quae cumque nisi architecto!',
            location: `${cities[randomNo].city}, ${cities[randomNo].country}`,
            timestamp: Date.now(),
            createDate: date,
            avgRating
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})