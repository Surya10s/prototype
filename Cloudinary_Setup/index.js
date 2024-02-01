const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.Cloudinary_CloudName,
    api_key: process.env.Cloudinary_API_KEY,
    api_secret: process.env.Cloudinary_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
    folder : 'suryafile',
    allowedFormats :['jpeg','png','jpg']
    }
})

module.exports={
    cloudinary,
    storage
}