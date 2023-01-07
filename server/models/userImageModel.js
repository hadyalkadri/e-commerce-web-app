const mongoose = require('mongoose');

var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


var Image = new Schema({
    image: {
        data:Buffer,
        contentType: String
    }
},
{
    timestamps: true
})

Image.plugin(passportLocalMongoose)

module.exports = mongoose.model('Image', Image)