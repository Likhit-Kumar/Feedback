const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    parent_comment_id: {
        type: String,
    },    
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, trim: true }        
},{
    timestamps : true,
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;