const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/tentjet', { useNewUrlParser: true, useUnifiedTopology: true })
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
    for (let i = 0; i < 50; i++) {
        const randomNo = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            title: `${randArray(descriptors)} ${randArray(places)}`,
            location: `${cities[randomNo].city}, ${cities[randomNo].state}`,
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})