const express = require("express");

const router = express.Router();
const bcrypt = require ("bcryptjs");
const passport=require("passport");


const User = require ("../models/user");
const {forwardAuthenticated}=require("../config/auth");

//GET for Login
router.get("/login",forwardAuthenticated,function(req,resp){
    resp.render("Login");
});



//GET for Register
router.get("/register",forwardAuthenticated,function(req,res){
    res.render("Register");
});


//POST for Register
router.post("/register", function(req,res){
    const { name, email, password, password2} =req.body;
    
   let errors=[];

//    //to check all fields required are filled
   if (!name || !email || !password || !password2){
       errors.push({msg:"Please fill all required fields"}); 
   }
    
//    //to check passwords
   if(password!==password2){
       errors.push({msg:"passwords do not match"});
   }

   if(password.length <4){
       errors.push({msg:"password should atleast have 4 characters"});
   }

   if (errors.length >0){
      resp.render("Register",{
          errors,
          name,
          email,
          password,
          password2
      })
   }
   
   else{
   User.findOne({name:name})
     .then(user => {
    if(user){
    //to check if user exist
    errors.push({msg: "user already exists"});
    resp.render("Register",{
        errors,
        name,
        email,
        password,
        password2
    });
    }
    else{
        const newUser = new User({
        name,
        email,
        password
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              req.flash(
                'success_msg',
                'You are now registered and can log in'
              );
              res.redirect('/user/login');
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
}
});

//POST for log in
router.post("/login", function(req,res,next){
    passport.authenticate("local",{
        successRedirect:"/Dashboard",
        failureRedirect:"/user/Login",
        failureFlash:true
    })(req,res,next);
  });
    // Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/Login');
  });
module.exports = router;
