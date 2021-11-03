const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { cloud } = require('./env')

cloudinary.config({
    cloud_name: cloud.name,
    api_key: cloud.key,
    api_secret: cloud.secret,
    secure: true
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'jpg', 'png']
    }
})

module.exports = {
    cloudinary,
    storage
}