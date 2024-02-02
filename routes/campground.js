const express = require('express')
const router = express.Router();
// const isloggedin = require('../middleware')
const middleware = require('../middleware')
const isAuthor = require('../middleware');
const controller = require('../controller/campgroundController');
const {joivalidation}= require('../middleware');
const multer = require('multer')
const {storage} = require('../Cloudinary_Setup')
const upload = multer({storage})
const axios = require('axios');
const campground = require('../model/campground');
router.get('/',controller.showCampground)


function isloggedin (req,res,next){
    if(!req.isAuthenticated()){
        req.session.redirectto = req.originalUrl
        req.flash('error','login must')
        return res.redirect('/loginform')
      }
      next()
}

router.get('/detial/:id',controller.detialCampground)

router.get('/editform/:id',middleware.isAuthor,isloggedin,controller.provideEditform)

router.get('/newitemform',isloggedin,controller.provideNewitemform)

router.put('/edit/:id',isAuthor,isloggedin,upload.array('image'),joivalidation,controller.editCampground) 

router.post('/newitem',isloggedin,upload.array('image'),joivalidation,controller.addNewitem)

router.delete('/delete/:id',isloggedin,controller.deleteCampground)

router.get('/viewusers',controller.viewusers)

module.exports = router

