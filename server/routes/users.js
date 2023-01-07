const express = require('express')
const usersRouter = express.Router()
const bodyParser = require('body-parser')

const User = require('../models/userModel')
const passport = require('passport')
const authenticate = require('../authenticate')
// const cors = require('./cors')

usersRouter.use(bodyParser.json())

// usersRouter.options('*', cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
usersRouter.get('/', authenticate.verifyUser,(req, res) => {
    res.send('Hello User')
})


usersRouter.post("/signup", (req, res, next) => {
    User.register(new User(
        {username: req.body.username}),
        req.body.password,
        (err, user) =>{
            if(err){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: 'Error signing up'})
            }
            else{
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration is successful'})
                })
            }
        }
    )
})

usersRouter.post('/login', passport.authenticate('local', {session: false}), (req, res, next) => {
    var token = authenticate.getToken({_id: req.user._id})
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json({success: true, token: token,status: 'You are successfully logged in'})
    
 })

 usersRouter.route('/logout')
.get((req, res) => {
    if (req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else{
        const err = new Error('You are not logged in!');
        err.status = 403;
        
        next(err);
    }
})

// usersRouter.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
//     passport.authenticate('jwt', {session: false}, (err, user, info) => {
//         if (err) {
//             return next(err);
//         }
//         if (!user){
//             res.statusCode = 401;
//             res.setHeader('Content-Type', 'application/json')
//             return res.json({status: 'JWT invalid', success: false, err: info})
//         }
//         else{
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json')
//             return res.json({status: 'JWT valid', success: true, user: user})
//         }
//     })(req, res);
// }) 
module.exports = usersRouter