const mongoose = require('mongoose');

var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//here no need to add username and password as the local passport will automatically add them for you
var User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:  String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)