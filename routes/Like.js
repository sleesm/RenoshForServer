const express = require('express');

const {getUserLike, postUserLike, putUserLike, deleteUserLike} = require('./Like_cosmos');
const router = express.Router();

//get user's like list
router.get("/:userid/", (req,res)=>{
    getUserLike(req,res);
})

//make user's like list
router.post("/:userid",(req,res)=>{
    postUserLike(req,res);
})

//add like
router.put("/:userid/",(req,res)=>{
    putUserLike(req,res);
})

//dislike
router.delete('/:userid',(req,res)=>{
    deleteUserLike(req,res);
})


module.exports = router;
