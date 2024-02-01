const mongoose = require('mongoose')
const {Schema} = mongoose

 const reviewschema = new Schema({
    body:String,
    rating : String,
    author : {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
 })

 module.exports = mongoose.model('review',reviewschema);