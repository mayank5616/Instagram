var express = require('express');
var router = express.Router();
const localStrategy = require('passport-local');
var userModel=require('./users')
var dpModel=require('./profile')
var passport=require('passport')
passport.use(new localStrategy(userModel.authenticate()));
const multer=require('multer')

var storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/images/upload')
  },
  filename:function(req,file,cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix+file.originalname)
  }
})
// const upload=multer({storage:storage})

const upload=multer({storage})
// upload2.single('bjk')
router.get('/', function(req, res, next) {
  res.render('mainpage');
});
router.get('/feed', function(req, res, next) {
  userModel.findOne({username:req.session.passport.user})
  .populate('post')
  .then(function(i){
    dpModel.find()
    .populate('user')
    .then(function(j){
      res.render('feed',{i,j})
    })
  })  
});


router.get('/router',function(req,res){
  res.render('multer')
})
router.get('/signup',function(req,res){
  res.render('index')
})
router.get('/mainpage',function(req,res){
  res.render('mainpage')
})
router.post('/register',function(req,res ,next){
  var newUser = new userModel({
    username : req.body.username,
    name:req.body.name
  })
  userModel.register(newUser , req.body.password )
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/feed')
    })
  })
})
router.post('/login',passport.authenticate('local',{
  successRedirect:'/feed',
  failureRedirect:'/'
}),function(req,res,next){})

router.post('/upload',upload.single('file'),function(req,res,next){
  userModel.findOne({username:req.session.passport.user})
  .then(function(i){
    i.dp=req.file.filename
    i.save()
    res.redirect('/feed')
  })
})
// router.post('/upload2',upload2.single('file2'),function(req,res,next){
//   userModel.findOne({username:req.session.passport.user})
//   .then(function(i){
//     i.dp2=req.files.filename
//     i.save()
//     res.redirect('/feed')
//   })
// })
router.post('/upload2',upload.single('image'),function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(fonduser){
    dpModel.create({
      name:req.body.name,
      location:req.body.location,
      user:fonduser
    })
    .then(function(u){
      console.log(req.file.filename)
      fonduser.post.push(u)
      fonduser.save()
      u.photo=req.file.filename
      u.save()
      res.redirect('/feed')
    })
  })
  
})
router.get('/like/:id',function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(i){
    dpModel.findOne({_id:req.params.id})
    // .populate('user')
    .then(function(may){
      if(may.like.indexOf(i.username)==-1){
        may.like.push(i.username)
      }
      else{
        var index=may.like.indexOf(i.username)
        may.like.splice(index,1)
      }
      may.save()
      .then(function(o){
        res.redirect("/feed")
      })
    })
  })
})
router.post('/comment/:p',function(req,res){
  console.log('hello')
  dpModel.findOne({_id:req.params.p})
  .then(function(a){
    a.comment.push([req.body.comment,req.session.passport.user])
    a.save()
    res.redirect('/feed')
  })
})
router.get('/logout' , function(req, res){
  req.logout();
  res.redirect('/');
})
module.exports = router;
