const campground = require("./model/campground")
const schema = require('./schema')
const apperror = require('./utils/errorapp')
module.exports = function isloggedin (req,res,next){
    if(!req.isAuthenticated()){
        req.session.redirectto = req.originalUrl
        req.flash('error','login must')
        return res.redirect('/loginform')
      }
      next()
}

module.exports.validatereview = (req,res,next)=>{
  const {error }= schema.reviewschema.validate(req.body);
  if(error){
   const mess = error.details.map(el => el.message).join(',') 
   throw new apperror(mess,400)
} else(
next()
)

}
module.exports.isAuthor = async (req,res,next)=>{
  // const { id } = req.params;
  // const item = await campground.findById(id);
  // if(!item.auther.equals(req.user._id)){
  //   req.flash('edit message','you dont have perssion to do that!')
  //   return res.redirect(`/campground/${id}`)
  // }
  next()
}

module.exports.joivalidation = (req,res,next)=>{
  const {error} = schema.campgroundshema.validate(req.body)
  if(error){
      const mess = error.details.map(el => el.message).join(',') 
      throw new apperror(mess,400)
  } else(
   next()
  )

}
