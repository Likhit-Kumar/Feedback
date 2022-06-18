const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    e : { type: String, required : true, trim : true, unique : true,},
    hash : { type: String,required : true },
    _n : { type: String, required: true },
    m: { type : String, required: true },
    dob: { type : String },
    _aid: { type : String },
    _ac: {
        qe: {
            type: 'String'
        },
        nbe: {
            type: 'String'
        },
        hrn: {
            type: 'String'
        },
    },
    admin: { type: String }
}, {
    timestamps : true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;