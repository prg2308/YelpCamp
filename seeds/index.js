const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')

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

async function seedDB() {
    await Campground.deleteMany({})
    for (let i = 0; i < 4; i++) {
        const randomNo = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            title: `${randArray(descriptors)} ${randArray(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem aut nemo totam, doloribus iusto architecto consequatur quo quia! Amet perferendis quia molestiae consequatur sapiente ducimus illo quae cumque nisi architecto!',
            location: `${cities[randomNo].city}, ${cities[randomNo].state}`,
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})