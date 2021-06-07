const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({

    title:String,
    body:String,
    author:String,
    likes: Number,
});

const Posts = mongoose.model('Posts',PostSchema);

module.exports = {
    Posts
}