if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
//------------------------------------------------------------
const helmet = require('helmet')
const express = require('express')
const ejsmate = require('ejs-mate')
const session = require('express-session')
const app = express();
const flash = require('connect-flash')
const path = require('path')
const mongosanitize = require('express-mongo-sanitize')
const methodoverride = require('method-override')
const mongoose = require("mongoose")
const campgrounds = require('./routes/campground')
const reviews = require('./routes/review')
const login_register = require('./routes/login_register')
const bodyparser = require('body-parser')
const mongostore = require('connect-mongo')
const passport = require('passport')
//---------------------------------------------------------------
const mongosAtlasUrl = process.env.mongosAtlasUrl

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
  .then(() => console.log('Connected!'))
  .catch(err => console.log("error during connected to the db"))

const db = mongoose.connection;
db.on('error',console.error.bind(console,'on no !!'))
db.once('open',()=>{
 console.log('database connected')
})
//-----------------------------------------------------------------
app.engine('ejs',ejsmate)
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs');

//-----------------------------------------------------------------
app.use(express.static('public'))
app.use(methodoverride('_method'))
app.use(mongosanitize());
app.use(express.urlencoded({extended:true}))
//---------------------------------------------------------------------
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store : mongostore.create({mongoUrl : 'mongodb://127.0.0.1:27017/passport-authendication',collectionName:'sessions',touchAfter:24*60*60}),
  cookie: { 
    maxAge: 1000*60*60*24
  }
}))
app.use(bodyparser.urlencoded({extended:flash}))
//------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

//-------------------------------------------------------------------------
app.use(flash());
app.use((req,res,next)=>{
  res.locals.currentuser = req.user;
  res.locals.message = req.flash('edit message')
  res.locals.error = req.flash('error')
  next()
})
//--------------------------------------------------------------------------

const scriptsrc = [ 
  "https://unpkg.com/",
  "https://cdn.jsdelivr.net/",
  "https://cloudinary.com/",
  "https://unpkg.com",
  "https://unpkg.com/leaflet/dist/leaflet.js",
  "https://unpkg.com/@turf/turf",
  "https://stackpath.bootstrapcdn.com/",
  "https://cdnjs.cloudflare.com/",
  "https://code.jquery.com/",
  "'unsafe-inline'",
  "'unsafe-eval'"]

const imgsrc = [
  'https://b.tile.openstreetmap.org/',
  "https://res.cloudinary.com",
  "https://t4.ftcdn.net",
  "https://c.tile.openstreetmap.org",
  "https://a.tile.openstreetmap.org",
  "https://unpkg.com",
  "data:"]

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'",],
        scriptSrc: ["'self'",...scriptsrc],
        imgSrc: ["'self'", ...imgsrc],
      },
    },
  })
);
//-----------------------------------------
app.get('/',(req,res)=>{
  res.render('home')
})
//------------------------------------------
app.use('/',login_register)
app.use('/campground',campgrounds)
app.use('/campground/:id/review',reviews)
//------------------------------------------
app.use((err,req,res,next)=>{
  const {status = 500,message = 'bad'} = err
  res.status(status)
  console.log('hitt')
  res.render('campground/error',{message})
  next()
})
//-----------------------------------------
app.listen(3000,()=>{
    console.log('listening on 3000:')
})