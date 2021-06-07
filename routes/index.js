const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

var csrfProtection = csrf({ cookie: true })

const {User} = require('../db/models.js')
const {forwardAuthenticated} = require('../config/auth');

router.use(cookieParser())

router.get('/',forwardAuthenticated,csrfProtection,(req,res)=>{
    res.render('home-guest',{ csrfToken: req.csrfToken()});
})

router.post('/register',csrfProtection,(req,res) =>
{
    const {username,email,password,password1} = req.body;

    let errors=[];
    if(!username || !email || !password)
    {
        error.push({msg:'Please enter all fields'});
    }

    if(password != password1)
    {
        errors.push({msg:'Passwords do not match'});
    }

    if(errors.length > 0)
    {
       return res.render('home-guest',{
            errors,username,email,password,password1,
            csrfToken: req.csrfToken()
        });
    }
    else
    {   
        User.findOne({username:username}).then(user =>
            {
            if(user)
            {
                errors.push({msg:'User Already Exists'}),
                 res.render('home-guest',{
                    errors,
                    username,
                    email,
                    password,
                    password1,
                    csrfToken: req.csrfToken()
                });
            }
            else
            {
                const newUser = new User({
                    username: username,
                    email:email,
                    password:password
                });

                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;

                        newUser.password = hash;
                        newUser.save().then(user =>{
                            req.flash(
                                'success_msg',
                                'You are now registed and can log in'
                            );
                            res.redirect('/')
                        }).catch(err => console.log(err));
                    })
                })
            }
        })
    }
})

router.post('/login', csrfProtection ,(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/user/home-dashboard',
        failureRedirect:'/',
        failureFlash:true      
    })(req,res,next);
});

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/');
});


module.exports = router;
