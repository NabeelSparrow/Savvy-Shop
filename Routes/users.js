const express = require('express');
const app = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {
    check,
    validationResult
} = require('express-validator');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');
require('../config/passport')(passport);

app.get('/',ensureAuthenticated, (req, res,next) => {
  
  console.log(req.user.password1);

    User.find()
    .then((results)=>{
      res.render('/signup',{users:results});
     res.send(results)
    })
    .catch(err=>{console.log(err)});

});

app.get('/signup',(req, res) => {
  
   res.render('signup');
});





app.post('/signup', [
    check('name', 'Name is Required').exists().isLength({
        min: 3
    }),
    check('email', 'Email is Required').exists().isEmail({
        min: 3
    }),
    check('email').custom(value =>{
        return User.findOne({email:value}).then(user=>{
            if(user)
            {
             return Promise.reject('E-mail already in use');
            }
        })
    }),
    //checking password exists
    check('password','Password is Required Password Must be atleast 6 character').exists().isLength({
        min: 6
    }),
    //matching passwords
    check('password1').custom((value,{req})=>{
        if (value !== req.body.password) {
            return Promise.reject('Password confirmation does not match password');
            }
            else{

                return true;
            }
    })   

], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render('signup', {
            alert
        });
    } else {
            const newuser = new User ({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                password1:req.body.password1
            })
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    if(err){throw err}

                    newuser.password = hash;
                    newuser.save()
                    .then(user =>{
                        req.flash('success','New User added.');
                        res.redirect('login');
                    })
                    .catch(err =>console.log(err))
                });
            });     
    }
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res, next) => {
    
    req.flash('success', 'You have logged in Successfully');
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })(req, res,next)
});








module.exports = app;