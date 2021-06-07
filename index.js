const express = require('express');
const Mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const socketio = require('socket.io');

require('./config/passport')(passport);

require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.use(
    session ({
        secret:'anything',
        resave:true,
        saveUninitialized:true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

const users ={};

const CONNECTION_URL =process.env.DB_STRING; //create a file name it .env , create variable name it as DB_STRING , paste your db stirng without quotes,don;t forget to install dotenv

const PORT = process.env.PORT || 3000;

Mongoose.connect(CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology:true})
    .then(() => 
    {
        const server = app.listen(PORT,() => console.log(`Server Started Running on port: ${PORT}`));
        const io = socketio(server);

        io.on('connection',socket =>{
        socket.on('new-user-joined', name =>{
            users[socket.id] = name;
            socket.broadcast.emit('user-joined',name);
        });
    
        socket.on('send', message =>{
            socket.broadcast.emit('recieve',{message:message , name:users[socket.id]})
        });
    
        socket.on('disconnnect',message =>{
            socket.broadcast.emit('left',users[socket.id]);
            delete users[socket.id];
        });
    
        }
    )})
    .catch((error) => console.log(error.message));



app.use(function(req,res,next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use('/user',require('./routes/users.js'))
app.use('/',require('./routes/index.js'));
app.use('*',(req,res) =>{

    res.status(404).render('404');
})
