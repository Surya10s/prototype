const mongoose = require("mongoose");
const review =  require('./rewiew')


const imageschema = new mongoose.Schema({
  url:String,
  filename : String
})

imageschema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_200')
})

 const campgroundschema = new mongoose.Schema({ 
    title : String,
    Price:{
      type : Number,
      required : true
    },
    description : String,
    location:String,
    geo_coordinates: {
      type: {
         type: String,
         enum: ['Point'],  // Specifies that the only valid value for 'type' is 'Point'
         default: 'Point'
      },
      coordinates: {
         type: [Number],
         required: true
      }
   },
    images : [imageschema],
    reviews : [{
      type : mongoose.Schema.Types.ObjectId,
      ref: 'review'
    }],
    author : {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
    
 })


 campgroundschema.post('findOneAndDelete',async function (doc){
   if(doc){
    await review.deleteMany({
      _id:{
        $in: doc.reviews
      }
    })
   }
 })

 module.exports = mongoose.model('campground',campgroundschema)