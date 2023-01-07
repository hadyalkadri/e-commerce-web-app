const mongoose = require('mongoose');

var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//here no need to add Ordername and password as the local passport will automatically add them for you
var Order = new Schema({
    orderItems: [
        {
        title: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        discountPercentage: {type: Number},
        rating: {type: Number, required: true},
        stock: {type: Number, required: true},
        brand: {type: String, required: true},
        category: {type: String, required: true},
        thumbnail: { type: String, required: true},
        images: {type: Array, required: true},
        productQuantity: {type: Number, required: true}
        }
    ],
    shippingAddress:{
        type:  String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String
    },
    totalPrice: {
        type: Number,
        required: true
    },
    user: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User'
        type: String
    }
},
{
    timestamps: true
})

// Order.plugin(passportLocalMongoose)

module.exports = mongoose.model('Order', Order)