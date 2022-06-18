const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register',async (req, res) => {
 
    console.log(req.body);

    //generate hashedPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.hash, salt);

    // const userExists = User.findOne({username:req.body.username});
    // if(userExists) return res.status(400).send("Username exists!");

    //create user
    const user = new User({
        e : req.body.e,
        hash : hashedPassword,
        _n : req.body._n,
        m : req.body.m,
    });
    try{
        const savedUser = await user.save();
        res.send({user : savedUser._id });
    }catch(err){
        console.log(err);
        
        res.status(400).send(err);
    }

});

router.post('/login',async (req, res) => {
    
    const user = await User.findOne({e : req.body.e});
    if(! user ) return res.status(400).json({ registered : false});

    console.log(user);
    const validPass = await bcrypt.compare(req.body.password, user.hash);
    if(!validPass) return res.status(400).json({password : false});

    //create token and add it to header
    const token = jwt.sign({ _id : user._id},process.env.TOKEN_SECRET);
    res.header('auth-header',token);
    res.json({user});

});

module.exports = router