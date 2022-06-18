const router = require('express').Router();
const Comment = require('../models/comment.model');
const verify = require('./verifyToken'); 
const User = require('../models/user.model');

router.get('/' , verify, async (req,res) => {
    try {
        let users;

        switch(type) {
            case 'text':
                users = await UserData.find({'e': req.body}) 
                console.log(users)
                break;
                // const userData = await UserData.find();      
        }
        if(!users.length > 0) {
            console.log("No Data Found")

        }
        res.status(200).json({users})
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
});

module.exports = router;