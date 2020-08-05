const express = require('express');
const { getListOfUsers, postUserInfo, getUserById, updateUserById, deleteUserById, getHglByUser, getHglByUser2 } = require('./User_cosmos');
const router = express.Router();


//get a list of all users
router.get('/', (req, res) => {
    getListOfUsers(req, res);
});

// post a user
router.post('/', (req, res) => {
    postUserInfo(req, res);
});

// get a specific user by id
router.get('/:user_id', (req, res) => {
    getUserById(req, res);
});

// put(update) a specific user by id
router.put('/:user_id', (req, res) => {
    updateUserById(req, res);
});

// delete a specific user by id
router.delete("/:user_id",(req, res)=>{
    deleteUserById(req, res);
});

//userDB 1st v: get user's highlights
router.get('/:user_id/highlights',(req, res)=>{
    getHglByUser(req,res);
})

//userDB 2nd v: get user's highlights
router.get('/:user_id/highlights2',(req, res)=>{
    getHglByUser2(req,res);
})
module.exports = router;

