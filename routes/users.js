var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var passportLocalMongoose=require('passport-local-mongoose')
mongoose.connect('mongodb+srv://mayank:83700@cluster0.ntcfy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
var userSchema=mongoose.Schema({
  username:String,
  name:String,
  password:String,
  dp:String,
  post:[{type:String}]
})
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('user',userSchema);
