const express = require('express')
const ProductsRoute = express.Router()
const bodyParser = require('body-parser')
const cors = require('./cors')
const Products = require('../models/productsModel')
// import productData from './files/productsData.json' assert {type: 'json'}
const fs = require('fs')


ProductsRoute.use(bodyParser.json())


ProductsRoute.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200)})
.get(cors.cors, async (req, res) => {
    // res.sendFile('/files/ProductsData.json', {root: __dirname})
    //res.send({message: 'hello here!'})
    
    Products.find({}, (err, data) => {
        if(err){
            res.send({err: err})
        }
        else{
            res.json(data)
        }
    })
    // const data = await Products.find({}).skip(pageSize * (page - 1)).limit(pageSize)
    
    // if (data){
    //     res.status(200).send(data)
    // }
    // else{
    //     res.status(404).send({err: err})
    // }
    
    

})

ProductsRoute.route('/categories')
.get( async (req, res) => {

    

    // const category = req.query.category
    // res.status(200).json({category})

    const categories = await Products.find({}).distinct('category')
    res.status(200).send(categories)
})



module.exports = ProductsRoute