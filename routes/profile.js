var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')

const bookSchema=mongoose.Schema({
  name:String,
  location:String,
  photo:String,
  like:Array,
  comment:Array,
  
  
  user:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
})

module.exports=mongoose.model('book',bookSchema)