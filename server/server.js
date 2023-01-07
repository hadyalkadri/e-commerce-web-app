const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const config = require('./config')

const cors = require('cors')
const authenticate = require('./authenticate')
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);

const hostname = 'localhost'
const port = 3003

const usersRouter = require('./routes/usersRouter')
// const productsRouter = require('./routes/productsRouter')
const ProductsRoute = require('./routes/ProductsRoute')
const OrderRoutes = require('./routes/OrdersRoute')
const PopulateRoute = require('./routes/PopulateRoute')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors());
app.use(passport.initialize())

//routers
// app.use('/products', productsRouter)
app.use('/users', usersRouter)
app.use('/product', ProductsRoute)
app.use('/orders' ,OrderRoutes)
app.use('/Populate', PopulateRoute)

app.get('/api/google-map', (req, res) => {
    res.send({api: config.Google_Map_API})
})

app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true },() => {
    console.log('You are connected to database')
}, (err) => {console.log(err)})



app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`)
})