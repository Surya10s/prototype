const review = require('../model/rewiew')
const campground = require('../model/campground')
const wrapasync = require('../utils/wrapasync')

module.exports.creatreview = wrapasync(async(req,res)=>{
    if(!req.isAuthenticated()){
   req.flash('error','login must')
      req.flash('edit message','loginmust')
   return  res.redirect(`/campground/detial/${req.params.id}`)
}
   const campgroundfetch = await campground.findById(req.params.id)
   const reviewnew = new review(req.body.Review)
   reviewnew.author =  req.user._id;
   campgroundfetch.reviews.push(reviewnew)
   await campgroundfetch.save()
   await reviewnew.save()
   res.redirect(`/campground/detial/${req.params.id}`)
  })

  module.exports.deletereview = wrapasync(async(req,res)=>{
    const {id,reviewid} = req.params
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid} })
    await review.findByIdAndDelete(reviewid)
    res.redirect(`/campground/detial/${id}`)
    })