const express = require('express')
const router = express.Router();
const isloggedin = require('../middleware')
const isAuthor = require('../middleware');
const controller = require('../controller/campgroundController');
const {joivalidation}= require('../middleware');
const multer = require('multer')
const {storage} = require('../Cloudinary_Setup')
const upload = multer({storage})
const axios = require('axios')
router.get('/',controller.showCampground)

router.get('/location',async(req,res)=>{
    const { query } = req.query;
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${opencage_apikey}`);
    const { lat, lng } = response.data.results[0].geometry;
    console.log(lat,lng);
    res.send('done')

})

router.get('/detial/:id',controller.detialCampground)

router.get('/editform/:id',isAuthor,isloggedin,controller.provideEditform)

router.get('/newitemform',isloggedin,controller.provideNewitemform)

router.put('/edit/:id',isAuthor,isloggedin,joivalidation,upload.array('image'),controller.editCampground) 

router.post('/newitem',isloggedin,upload.array('image'),joivalidation,controller.addNewitem)

router.delete('/delete/:id',isloggedin,controller.deleteCampground)

module.exports = router

