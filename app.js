const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true , useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
  username:String,
  password:String
});



const User = new mongoose.model("User",userSchema);
app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      username:req.body.username,
      password:hash
    })
    newUser.save(function(err){
      if(!err){
        res.render("login")
      }else{console.log(err);}
    });
});


});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username:username},function(err, found){
    if(err){
      console.log(err);
    }else{
      if(found){
        bcrypt.compare(password, found.password, function(err, result) {
          if(result == true){
            res.render("secrets");
          }
      });
      }
    }
  });
});







app.listen(3000,function(){
  console.log("Server is running at port 3000");
});
