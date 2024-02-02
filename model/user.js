var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userschema = new Schema({
  username: {
    type : String,
    unique : true,
    required : true,
    minlength: 5
  },
  password: {
    type : String,
    minlength: 5,
    required:true
  }
});
userschema.pre('save',async function(next){
  if(!this.isModified('password')) return next()
this.password =  await bcrypt.hash(this.password,12)
  next()
})
module.exports = mongoose.model('User',userschema)