const express = require('express')
const cors = require('cors')

const app = express()

const whitelist = ['http://localhost:3000']

const  corsOptionsDelegate = (req, callBack) => {
    var corsOptions;
    //checking if this path is present in the area if not, it will yeild -1
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = {origin: true}
    } else{
        corsOptions = {origin: false}
    }  
    callBack(null, corsOptions)
}

exports.cors = cors()
//use this for senstitive routes
exports.corsWithOptions = cors(corsOptionsDelegate)