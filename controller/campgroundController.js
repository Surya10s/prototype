const campground = require('../model/campground')
const wrapasync = require('../utils/wrapasync')
const apperror = require('../utils/errorapp')
const {cloudinary} = require('../Cloudinary_Setup')
const axios = require('axios')
const User = require('../model/user')
const user = require('../model/user')
module.exports.showCampground = wrapasync( async (req,res)=>{
    const camp = await campground.find({})
    res.render('campground/showpage',{campground : camp})
})

module.exports.detialCampground = async (req,res,next)=>{
    const camp1 = await campground.findById(req.params.id)
    .populate({
      path :'reviews',
      populate: {
        path :'author'
      }
    }).populate('author')
    if(!camp1){
      return next( new apperror('not found ',401));
    }
    res.render('campground/detial',{detials : camp1})
  } 

module.exports.provideEditform = async(req,res,next)=>{
    try{
    const {id}= req.params
    const camp1 = await campground.findById(id)
    res.render("campground/editform",{id,camp1})}
    catch(e){
      next(e)
    }
  }

  module.exports.provideNewitemform = (req,res) => {
    res.render('campground/newitemform')
  }

  module.exports.editCampground = wrapasync(async(req,res)=>{
    const {id}= req.params
    const newone = await campground.findByIdAndUpdate(id,req.body.campground,{runValidater : true})
    const {location} = req.body.campground
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.opencage_apikey}`);
    
    if(response.data.total_results){
      const { lat, lng } = response.data.results[0].geometry
      newone.geo_coordinates.coordinates = [lat,lng]
   
    }else{
      newone.geo_coordinates.coordinates = [0 , 0]
    }
    const new_images = req.files.map(f=>({url:f.path,filename:f.filename}))
    newone.images.push(...new_images)
    await newone.save()
    if(req.body.deleteimage){

      for(let filename of req.body.deleteimage){
        await cloudinary.uploader.destroy(filename)
      }
      //here we deleting images from campground
      //image:[{url:eee,filename:eee},{url:eee,filename:dfdf}]
      await newone.updateOne({$pull:{images:{filename:{$in:req.body.deleteimage}}}})
    }
    req.flash('edit message','modified')
    res.redirect(`/campground/detial/${newone._id}`)
  })

module.exports.viewusers = async (req,res,next)=>{
  const items = await user.find({})
  res.render('campground/viewusers',{items})

}
  module.exports.addNewitem = async(req,res,next)=>{

    try{
    const item =  new campground(req.body.campground)
    const {location} = req.body.campground
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.opencage_apikey}`);
    if(response.data.total_results){
      const { lat, lng } = response.data.results[0].geometry
      item.geo_coordinates.coordinates = [lat,lng]
   
    }else{
      item.geo_coordinates.coordinates = [0 , 0]
    }
    item.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    item.author = req.user._id;
    await item.save()
    req.flash('edit message','created successfully')
    res.redirect(`/campground/detial/${item._id}`)}
    catch(e){
      next(e)
    }
  }

module.exports.deleteCampground = wrapasync( async(req,res)=>{
    const{id} = req.params;
    await campground.findByIdAndDelete(id)
    req.flash('edit message','Deleted successfully')
    res.redirect('/campground')
  })