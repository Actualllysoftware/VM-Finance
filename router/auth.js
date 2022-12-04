const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("users");
const crypto = require('crypto')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config/key")

//bb998951a394eaecc21f4bdea2db3056-2af183ba-8cf0f1bb


//e-mail verification
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxc80e8668dc1441908ea8c3170d6a1f09.mailgun.org';
const mg = mailgun({apiKey: "bb998951a394eaecc21f4bdea2db3056-2af183ba-8cf0f1bb", domain: DOMAIN});

//SighUP
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if( !email || !password ||!name ) {
        return res.status(422).json({error:"fill the field"})
    }
    User.findOne({email: email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"email already exist"})
        }
        //hashing password
        bcrypt.hash(password, 12)
        .then(hashedpassword=>{
            const user = new User({
                name : name,
                email : email,
                password: hashedpassword,
                pic: pic
            })
            user.save()
            .then(user=>{

                // const data = {
                // to: user.email,
                // from: 'leoraj@hellow.com',
                // subject: 'Account Activation Link',
                // html: "<h1>welcome to instagram<h1>"
                // };
                // mg.messages().send(data, function (error, body) {
                //     if(error){
                //         return res.json({
                //             message: error.message
                //         });
                //     } 
                //     console.log(body);
                //     }); 
                res.json({message:"user successfully saved "})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
        
    })
    .catch(err=>{
        console.log(err)
    })  
});

//SignIn
router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email ||!password){
        return res.status(422).json({error: "fill the field"})
    }
    User.findOne({email: email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //return res.json({message:"successfully signed in"})
                const token = jwt.sign({_id: savedUser._id},JWT_SECRET)
                const {_id,name,email,pic} = savedUser
                res.json({token,user:{_id,name,email,pic}});
            }else{
                return res.status(422).json({error: "Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

//Reset Password
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User with this email not exist"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save()
            .then((result)=>{
                const data = {
                    to: user.email,
                    from: 'leoraj@hellow.com',
                    subject: 'Account Activation Link',
                    html: `<h1>INSTAGRAM<h1>
                    <p>You required for Reset-password</p>
                    <h5>Click <a href="http://localhost:3000/reset/${token}">HERE</a> to reet password</h5>`
                    }
                    mg.messages().send(data, function (error, body) {
                        if(error){
                            return res.json({
                                message: err.message
                            });
                        } 
                        console.log(body);
                        });
                        res.json({message:"check your email"})
            })

        })  
    })
})

//New password
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((savedUser)=>{
                res.json({message:"password updated successfully"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})
module.exports = router