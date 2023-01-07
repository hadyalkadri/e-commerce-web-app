const mongoose = require('mongoose');

var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//here no need to add Populatename and password as the local passport will automatically add them for you
var Populate = new Schema({
    name: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
})

// Populate.plugin(passportLocalMongoose)

module.exports = mongoose.model('Populate', Populate)