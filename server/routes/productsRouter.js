const express = require('express')
const productsRouter = express.Router()
const bodyParser = require('body-parser')
const cors = require('./cors')

const productsModel = require('../models/productsModel')
const Products = new productsModel
const passport = require('passport')
const authenticate = require('../authenticate')

productsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200)})
.get(cors.cors ,(req, res, next) => {
    //.find({}) when set to empty brackets gets all the content of a database
    productsModel.find(req.query)
    .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'appliaction/json')
        res.json(product)
    }, (err) => next(err))
    .catch((err) => next(err))
    })
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => { 

    productsModel.create(req.body)
    .then((product) => {
        console.log('Product is added', product)
        res.statusCode =200
        res.setHeader('Content-Type', 'appliaction/json')
        res.json(product)
    }, (err) => next(err))
})
.delete(cors.corsWithOptions, (req, res, next) => {

    productsModel.remove({})
    .then((res) => {
        res.statusCode =200
        res.setHeader('Content-Type', 'appliaction/json')
        res.json(res)
    }, (err) => next(err))
});



module.exports = productsRouter