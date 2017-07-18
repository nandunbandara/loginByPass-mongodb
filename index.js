'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const app = express();
//set bodyparser
app.use(bodyParser.json());
//connect to database
mongoose.connect('mongodb://root:pass123@ds141410.mlab.com:41410/testing_webapps',function(err){
    if(err){
        console.log('can not connect to the database');
        return -1;
    }
    console.log('connected to the database');
})
//user model
const User = new mongoose.Schema({
    username:String,
    password:String
})


//forbidden access on root
app.get('/', function(req,res){
    res.status(403).json({error:'can not access'});
})

//authenticate/login user
app.get('/users/authenticate',function(req,res){
    User.findOne({username: req.body.username, password: req.body.password}, function(err,user){
        if(err)
            res.status(500).json({error:'could not authenticate user'});
        else
            res.json(user);
    })
})

//add new user
app.post('/users', function(req,res){
    console.log(req.body);
    var user = new User.({ username:req.body.username, password:req.body.password });

    user.save(function(err, user){
        if(err)
            res.status(400).json({error:'could not add user'});
        else
            res.json(user);
    })
})

app.listen(8001, function(err){
    if(err){
        console.log('can not listen on port 8001');
        return -1;
    }
    console.log('listening on port 8001');
})