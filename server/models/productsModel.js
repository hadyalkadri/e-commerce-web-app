const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number
    },
    rating: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true
    },
    inStock: {
        type: Boolean
    }
},
{
    timestamps: true
}
)

const Products = mongoose.model('Products', productsSchema)
module.exports = Products