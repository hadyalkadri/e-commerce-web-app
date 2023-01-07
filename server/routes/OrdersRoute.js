const express = require('express')
const OrdersRoute = express.Router()
const bodyParser = require('body-parser')
const cors = require('./cors')
const User = require('../models/userModel')
const Order = require('../models/OrderModel')
const Product = require('../models/productsModel')
// import productData from './files/OrdersData.json' assert {type: 'json'}
const fs = require('fs')
const authenticate = require('../authenticate')



OrdersRoute.use(bodyParser.json())


OrdersRoute.route('/')
.post(authenticate.isAuth, async (req, res) => {
    
    const userInfo = req.userInfo
    const newOrder = new Order({
        orderItems: req.body.cartItems,
        shippingAddress: req.body.address,
        fullName: req.body.fullName,
        paymentMethod: req.body.paymentMethod,
        totalPrice: req.body.totalPrice,
        user: userInfo
    })
    const order = await newOrder.save()
    
    // const authorization = await  req.headers.authorization
    res.statusCode = 200;   
    res.setHeader('Content-Type', 'application/json')
    res.json({success: 'Order was successful.', order})
})
.get( async (req, res) => {
    
    const order = await Order.find({})
    if (order){
        res.statusCode = 200;   
        res.setHeader('Content-Type', 'application/json')
        res.json({success: 'Order was found.', order})
    }
    else{
        res.status(401).send({message: 'Order not Found'})
    }
})

OrdersRoute.route('/summary')
.get(authenticate.isAuth, authenticate.verifyAdmin,async (req, res ) => {
    const orders = await Order.aggregate([
    {
        $group: {
            _id: null, numOrders: {$sum: 1},
            totalSales: {$sum: '$totalPrice'}
        }
    }
    ])
    const users = await User.aggregate([
    {
        $group: {
            _id: null, numUsers: {$sum: 1}
        }
    }
    ])
    const dailyOrders = await Order.aggregate([
        {
        $group: {
            _id: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
            orders: {$sum: 1},
            sales: {$sum: '$totalPrice'}
        }
    }
    ])
    const productCategory = await Product.aggregate([
    {
        $group: {
            _id: '$category',
            count: {$sum: 1}
        }
    }
    ])
    res.json({summary: {users, orders, dailyOrders, productCategory}})
})



// authenticate.mailgun.messages().send({
//     'from': '<mg.yourdomain.com>',
//     to: `<${userEmail}>`,
//     subject: `New Order ${order._id}`,
//     html: authenticate.payOrderEmailTemplate(order)
// }, (err, body) => {
//     if(err){
//         console.log(err)
//     }
//     if (body){
//         console.log(body)
//     }
// })
//const userEmail = User.findById(userInfo).then((user) => {return user.email})

module.exports = OrdersRoute