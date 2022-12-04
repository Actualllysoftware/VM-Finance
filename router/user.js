const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("posts")
const requireLogin = require('../middleware/requireLogin');
const User = mongoose.model("users");

router.get('/users/:id',(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})




module.exports = router