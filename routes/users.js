const express = require('express');
const router = express.Router();
const { isValidObjectId } = require('mongoose')
const { Mongoose } = require('mongoose');
var cookieParser = require('cookie-parser')    //for cookie parsing
var csrf = require('csurf') 
const {Posts} = require('../db/posts.js')
const {ensureAuthenticated , forwardAuthenticated} = require('../config/auth')
const {findAllposts , findUserposts , findPost , updatePost, deletePost}  = require('../controllers/fetch');


var csrfProtection = csrf({ cookie: true });
router.use(cookieParser())

router.get('/',forwardAuthenticated,(req,res) =>{
    res.status(200).render('home-dashboard',{user:req.user});
})

router.get('/chat-user',ensureAuthenticated,async(req,res)=>{

    res.status(200).render('chat-user',{username:req.user.username});
})

router.get('/home-dashboard',ensureAuthenticated,async (req,res)=>{

    const post = await findAllposts();
    res.status(200).render('home-dashboard',{user:req.user , post:post});
});

router.get('/profile',ensureAuthenticated,async (req,res)=>{

    const username = req.user.username;
    const post = await findUserposts(username);

    res.status(200).render('profile',{user:req.user,post:post});
})

router.get('/post/:id',csrfProtection,async(req,res)=>{
    const id = req.url.slice(6,);
    const post = await findPost(id);
    if(post != 0)
    {
     return res.status(200).render('single-post-screen',{post:post,csrfToken: req.csrfToken()});
    }
    else{
        res.status(404).redirect('/unknown');
    }
})

router.post('/post/:id', csrfProtection ,async(req,res)=>{
        const id = req.url.slice(6,);
        const {title,body} = req.body;
        const flag = await updatePost(id,{title,body});
        if(flag === 1)
        {
          return  res.status(200).redirect('/user/profile');
        }
        else
        {   
            res.status(404).redirect('/user/home-dashboard');
        }      
})

router.get('/post/delete/:id',async(req,res)=>{
    const id = req.url.slice(13,);
    const flag = await deletePost(id); 
    if(flag === 1)
    {
       return res.status(200).redirect('/user/profile');
    }
    else
    {   
        res.status(204).redirect('/user/home-dashboard');
    }
})

//create post - get
router.get('/create-post',ensureAuthenticated,csrfProtection,(req,res)=>{
    res.status(200).render('create-post',{ csrfToken: req.csrfToken() });
})


//create post - post
router.post('/create-post',ensureAuthenticated,csrfProtection,(req,res)=>{
    const {title,body} = req.body;
    let error=[];
    if(!title || !body )
    {
        error.push({msg:'Please enter all fields'});
    }

    if(error.length > 0)
    {
       return res.status(406).render('create-post',{
            title,body,error
        });
    }

    else{

        const newPost = new Posts ({
            title:title,
            body:body,
            author:req.user.username,
            likes:0
        })

        newPost.save().then(user =>{
            req.flash(
                'success_msg',
                'New Post Successfully Created'
            );
            res.status(200).redirect('/user/home-dashboard')
        }).catch(err => console.log(err));
    }
})

router.use('*',(req,res) =>{

    res.status(404).redirect('/unknown');
})


module.exports = router;
