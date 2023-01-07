const express = require('express')
const PopulateRoute = express.Router()
const bodyParser = require('body-parser')
const cors = require('./cors')
const Populate = require('../models/PopulateModel')
const User = require('../models/userModel')
// import productData from './files/PopulateData.json' assert {type: 'json'}
const fs = require('fs')
const authenticate = require('../authenticate')


PopulateRoute.use(bodyParser.json())


PopulateRoute.route('/')
.get((req, res,next) => {
    const id = req.body._id
    Populate.find({})
    .populate('User')
    .then((item) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({response: item})
    })
}
)
.post((req, res) => {
   
    const newPopulate = new Populate({
        name: req.body.name,
        user: req.body.user
    })
    const populate = newPopulate.save()
    res.status(200).json({mess: 'Populated'})
})



module.exports = PopulateRoute