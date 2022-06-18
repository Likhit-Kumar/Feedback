const router = require('express').Router();
const Comment = require('../models/comment.model');
const verify = require('./verifyToken'); 

// router.post('/' , async (req,res) => {
//     // console.log(req.user._id)
//     await Comment.findById(req.user._id)
//         .populate('user')
//         .then(comments => {
//             console.log(comments)
//             res.json(comments)})
//         .catch(err => res.status(400).json('Error' + err));
// });

router.get('/' , async (req,res) => {
    // console.log(req.user._id)
    await Comment.find()
        .populate('user')
        .sort({'createdAt':-1})
        .then(comments => {
            res.json(comments)})
        .catch(err => res.status(400).json('Error' + err));
});

router.post('/add', verify,async (req,res) => {

    // console.log(req.user);
    const comment = new Comment({

        user : req.user._id,
        content : req.body.content

    });
    try {
        const savedComment = await comment.save();
        const savedCommentWithUserData = await Comment.findById(savedComment._id).populate('user');
        res.send(savedCommentWithUserData); 
    }catch(err){
        res.status(400).send(err);
    }
})


module.exports = router;