const express = require('express');
const usersRouter = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer')
const User = require('../models/userModel');
const Image = require('../models/userImageModel')
// const passport = require('passport')
const authenticate = require('../authenticate');
// const cors = require('./cors')
const bcrypt = require('bcrypt');
const users = require('./files/usersData');
const path = require('path')

const Storage = multer.diskStorage({
   destination: (req, file, cb) => {
    //file = req.body.file
    cb(null, __dirname)
   },
   filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
    console.log(file)
   }
})

const uploadImage = multer({
    storage: Storage
})

usersRouter.use(bodyParser.json());

usersRouter.use(bodyParser.urlencoded());

// usersRouter.options('*', cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
usersRouter.get('/',authenticate.isAuth, authenticate.verifyAdmin ,async (req, res) => {
    const users = await User.find({});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.send({users})
})


// usersRouter.post("/signup", (req, res, next) => {
//     User.register(new User(
//         {email: req.body.username}),
//         req.body.password,
//         (err, user) =>{
//             if(err){
//                 res.statusCode = 500;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.send({err: 'Error signing up'})
//             }
//             else{
//                 passport.authenticate('local')(req, res, () => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.send({success: true, status: 'Registration is successful'})
//                 })
//             }
//         }
//     )
// })

usersRouter.post("/signup", (req, res, next) => {
    User.findOne({email: req.body.email}).then((user) => { 
            if(user){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'A user already exists with the same email.'})
            }
            else{
                const passWord = bcrypt.hashSync(req.body.password, 2)
                const newUser = new User({
                    email: req.body.email,
                    password: passWord
                })
                 newUser.save()
                res.status(200).json({success: true, status: 'Registration is successful'})
             
            }
        })
     
})

// usersRouter.post('/login', passport.authenticate('local', {session: false}), (req, res, next) => {
//     User.findOne({username: req.body.username}).then((user) => {


//         if (!user){
//             return(
//                 res.status(401).send({
//                     success: false,
//                     message: 'Could not find user.'
//                 })
//             )
//         }




//         var token = authenticate.getToken({_id: req.user._id})
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/text')
//         res.text({success: true, token: token,status: 'You are successfully logged in'})



//     })
    
//  })

//  usersRouter.route('/logout')
// .get((req, res) => {
//     if (req.session){
//         req.session.destroy();
//         res.clearCookie('session-id');
//         res.redirect('/');
//     }
//     else{
//         const err = new Error('You are not logged in!');
//         err.status = 403;
        
//         next(err);
//     }
// })

// // usersRouter.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
// //     passport.authenticate('jwt', {session: false}, (err, user, info) => {
// //         if (err) {
// //             return next(err);
// //         }
// //         if (!user){
// //             res.statusCode = 401;
// //             res.setHeader('Content-Type', 'application/text')
// //             return res.text({status: 'JWT invalid', success: false, err: info})
// //         }
// //         else{
// //             res.statusCode = 200;
// //             res.setHeader('Content-Type', 'application/text')
// //             return res.text({status: 'JWT valid', success: true, user: user})
// //         }
// //     })(req, res);
// // })

usersRouter.post('/login', (req, res) => {
    const password = req.body.password
    const userPassword = users.users[0].password
    User.findOne({email: req.body.email}).then((user) => {
        // if (err){
        //     return res.status(400).json({err: 'User could not be found'})
        // }

        if (user){
            const passwordValid = bcrypt.compareSync(password, user.password)
            if(!passwordValid){
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json')
                return res.send({success: 'password is not valid', mess: passwordValid})

            }else{
                var token = authenticate.getToken(user)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                return res.send({status: true, token: token, success: 'password is valid', user: user._id, isAdmin: user.admin})
                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'application/json');
                // return res.send({success: 'password is valid', mess: passwordValid})
            } 
        }
        else{
            return res.status(400).json({success: 'User email not found'})
        }
    })
    })
    // const passwordValid = bcrypt.compareSync(password, userPassword) //return true or false; compareSync
    // if(!passwordValid){
    //     res.statusCode = 401;
    //     res.setHeader('Content-Type', 'application/json')
    //     return res.send({error: 'password is not valid', mess: passwordValid})

    // }else{
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     return res.send({success: 'password is valid', mess: passwordValid})
    // }
    // res.send({password, userPassword})   
// })

usersRouter.put('/updateUser', authenticate.isAuth, async (req, res) => {
    const user = await User.findById(req.userInfo)
    if (user){
        user.email = req.body.email || user.email;
        if (req.body.password){
            user.password = bcrypt.hashSync(req.body.password, 2)
        }
        const updateUser = await user.save()
        var token = authenticate.getToken(updateUser)
        res.statusCode = 200;
        res.send({
            _id: updateUser._id,
            email: updateUser.email,
            password: updateUser.password,
            token: token
        })
    } else{
        res.status(401).send({mess: 'user not found'})
    }
})
//this route for admin users to update list of users
usersRouter.put('/:id', authenticate.isAuth, authenticate.verifyAdmin, async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user){
        if (user.admin === true){
            res.status(404).send({message: 'Cannot update admin user!'})
        }
        else{
            user.email = req.body.email || user.email;
            if (req.body.password){
                user.password = bcrypt.hashSync(req.body.password, 2)
            }
            if(req.body.admin === true){
                user.admin = true
            }
            const updateUser = await user.save()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send({message: 'User Updated Successfully', user: updateUser})
        }
    }

})

//User Image Upload Router
usersRouter.post('/upload/:id', uploadImage.single('file'),async (req, res) => {
    //const user = await User.findById(req.params.id)
    
    console.log(req.file)
    // if (user){
        const image = await new Image({
            image: {
                data:req.file.originalname,
                contentType: 'image/png'
            }    
        })
        image.save()
        res.status(200).send({message: 'Successful', info: req.file} )
    //}
    // else{
    //     res.status(401).send('Please sign up to access this information')
    // }
   
})

usersRouter.get('/userImages/:id',  async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user){
        await Image.find({}).then((img, err) => {
            if(err){
                res.status(400).send({err: new Error('ERROR CAUGHT!')})

            }
            else{
                //const imgBase64 = img.img.data.toString("base64");
                Object.entries(img).map((img) => {
                    const [key, value] = img;
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(value.image.data)))
                    res.status(200).json(base64)
                })
            }
        })
    }
})
    



usersRouter.delete('/:id', authenticate.isAuth, authenticate.verifyAdmin, async (req, res) =>{
    const user = await User.findById(req.params.id)
    
    if (user){
        if (user.admin === true){
            res.status(404).send({message: 'Cannot delete admin user!'})
        }
        else{
        const deleteUser = await user.remove()
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.send({message: 'User deleted Successfully', user: deleteUser})
        }
    }
    else{
        res.status(404).send({message: 'User Not Found'})
    }
})

module.exports = usersRouter
