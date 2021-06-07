const Mongoose = require('mongoose');
const {Posts} = require('../db/posts');

Mongoose.set('useFindAndModify', false);

async function findAllposts(query)                //FINDING ALL NEW POST.
{
    const posts = await Posts.find(function(err) {
        if(err) return console.error(err);
    }).sort({_id:-1});
    return posts
}

async function findUserposts(username)
{
    const posts = await Posts.find({author:username}).sort({_id:-1});
    return posts
}

async function findPost(id) {
    try{
    const post = await Posts.findById(id)
    return post 
    }
    catch(err)
    {
        return 0;
    }
} 

async function updatePost(id,data)
{
    try {
        await Posts.findByIdAndUpdate(id,data);
        return 1;
    }
    catch(error)
    {
        return 0;
    }
}

async function deletePost(id)
{
    try {
        await Posts.findByIdAndDelete(id);
        return 1;
    }
    catch(err)
    {
        return 0;
    }
}

module.exports ={
    findAllposts, findUserposts, findPost , updatePost , deletePost
}