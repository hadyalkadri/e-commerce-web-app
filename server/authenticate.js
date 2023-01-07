// const passport = require('passport');
// const localStrategy = require('passport-local').Strategy;
const User = require('./models/userModel')
// const jwtStrategy = require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken')
const mg = require('mailgun-js')

const config = require('./config')

// exports.local = passport.use(new localStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        admin: user.admin
    }, config.secretKey, {expiresIn: 3600})
}

exports.isAuth = (req, res, next) => {
    const authorization = req.headers.authorization
    if (authorization){
        const token = authorization.slice(7, authorization.length)
        jwt.verify(token,
            config.secretKey,
            async (err, decode) => {
                if (err){
                    res.status(401).send({message: 'Token is invalid'})
                } else{
                    req.user = decode
                    req.userInfo = await User.findById(req.user._id).then((user) => {
                        return user._id
                    })
                    next()
                }
            })
    }
    else{
        res.status(401).send({message: 'No token'})
    }
} 
//this is working code
// const opts = {};
// opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = config.secretKey

//this is working code
// exports.jwtPassoprt = passport.use(new jwtStrategy(opts,
//     (jwt_payload, done) => {
//         console.log('jwt_payload', jwt_payload) 
//         User.findOne({_id: jwt_payload._id}, (err, user) => {
//             if (err) {
//                 return done(err, false)
//             }
//             else if(user){
//                 return done(null, user)
//             }
//             else{
//                 return done(null, false)
//             }
//         })
//     }
//     ))

//this is working code
// exports.verifyUser = passport.authenticate('jwt', {session: false})

//not working code
// exports.verifyOrdinaryUser = function (req, res, next) {
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];

//     // decode token
//     if (token) {
//         // verifies secret and checks exp
//         jwt.verify(token, config.secretKey, function (err, decoded) {
//             if (err) {
//                 var err = new Error('You are not authenticated!');
//                 err.status = 401;
//                 return next(err);
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         // if there is no token
//         // return an error
//         var err = new Error('No token provided!');
//         err.status = 403;
//         return next(err);
//     }
// };


//this is working code
// exports.verifyAdmin = (req, res, next) => {
//     if (req.user.admin)
//         next();

//     else {
//         var err = new Error('Only admin can do it');
//         err.status = 403;
//         return next(err);
//     }
// };

exports.verifyAdmin = async (req, res, next) => {
    await User.findById(req.user._id).then((user) => {
        if (user.admin){
            next()
        }
        else{
            var err = new Error('Only admin can do it');
            err.status = 403;
            return next(err);
        }
    })
}

// exports.mailgun = mg({
//     apiKey: config.mailgun_API_KEY,
//     domain: config.mailgun_DOMAIN
// })

// exports.payOrderEmailTemplate = (order) => {
//     return `<h1>Thanks for shopping with us</h1>
//     <p>
//     Hi ${order.fullName} </p>
//     <p>We have finished processing your order.</p>
//     <table>
//     <thead>
//     <tr>
//     <td><strong>Product</strong></td>
//     <td><strong>Quantity</strong></td>
//     <td><strong align="right">Price</strong></td>
//     </tr>
//     </thead>
//     <tbody>
//     ${order.orderItems.map(
//         (item) => `
//         <tr>
//         <td>${item.title}</td>
//         <td align="center">${item.productQuantity}</td>
//         <td align="right">$${item.price}</td>
//         </tr>
//         `
//     )}
//     </tbody>
//     </table>
//     <p>Thank you for your time.</p>
//     `
// }