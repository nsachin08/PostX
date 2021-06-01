const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.get('/',(req,res) =>{
    res.render('404')
})

app.listen(3000,()=>{
    console.log('Server started at localhost:3000');
})