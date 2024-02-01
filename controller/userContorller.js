const { model } = require('mongoose')
const User = require('../model/user')
const wrapasync = require('../utils/wrapasync')

module.exports.provideLoginForm = (req,res)=>{
    res.render('loginForm')
  }

module.exports.registerUser = wrapasync(async(req,res)=>{

    const {password , username} = req.body
      if(!username ) {
        req.flash('edit message','username is required')
        return res.redirect('/registerform')
        }
        if(!password){   
          req.flash('edit message','enter the password')
        return res.redirect('/registerform')}
  try{
      const user =  new User({username,password})
       await user.save()
      req.session.username = username 
      res.redirect('/loginform')}catch(e){
        req.flash('edit message',e.message)
        return res.redirect('/registerform')
      }
    })
module.exports.provideregisterForm = (req,res)=>{
  res.render('registerForm')
}
let returnto = '/campground'
module.exports.storeReturnTo=(req, res, next)=> {
 
  if ( req.session.redirectto) {
      returnto =  req.session.redirectto;
  }
  delete req.session.redirectto
  next();
}

module.exports.loggingout = (req,res,next)=>{
  req.logout(function (err) {
    if (err) {
        return next(err);
    }
    req.flash('edit message', 'Goodbye!');
    res.redirect('/campground');
});
}