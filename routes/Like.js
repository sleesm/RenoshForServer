const express = require('express');

const {getUserLike, putUserLike, deleteUserLike} = require('./Like_cosmos');
const router = express.Router();

//get user's like list
router.get("/:userid/", (req,res)=>{
    getUserLike(req,res);
})

//add like
router.put("/:userid/",(req,res)=>{
    putUserLike(req,res);
})

//delete like
router.delete('/:userid',(req,res)=>{
    deleteUserLike(req,res);
})


module.exports = router;
