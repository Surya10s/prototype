const express = require('express')
const User = require('../model/user')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const userController = require('../controller/userContorller')
//-----------------------------------------------------------------------------
// Initialize Passport
//using local strategy
passport.use(new LocalStrategy(

 function (username, password, done) {

    if(!username) {
       return done(null, false,{message:'username required'}); }
       User.findOne({ username: username }).then((user)=>{
        if (!user) { return done(null, false,{message:'username or password is incorrect'}); }
        if (!bcrypt.compare(password,user.password)) { 
          return done(null, false,{message:'username and password is incorrect'}); }
        return done(null, user);
    
    })
  }
));
//---------------------------------------------------------------------------------
//serializing and deserilalizing user form sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
//------------------------------------------------------------------------------------
let returnto = '/campground'
function storeReturnTo(req, res, next) {
 
  if ( req.session.redirectto) {
      returnto =  req.session.redirectto;
  }
  delete req.session.redirectto
  next();
}
//-------------------------------------------------------------------------------------

  router.get('/loginform',userController.provideLoginForm)
  
  router.post('/login',
  storeReturnTo,
  passport.authenticate('local', {failureFlash:true, failureRedirect:'loginform'}),
  (req,res)=>{  
    req.flash('edit message','succesfully logged in')
    res.redirect(returnto)
  })
  
  router.get('/registerform',userController.provideregisterForm)
  
  router.post('/register',userController.registerUser)

  router.get('/logout',userController.loggingout)

  module.exports = router