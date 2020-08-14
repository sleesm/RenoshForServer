const express = require('express');
const { getListOfUsers, getMyBookListOfUsersById, postUserInfo, getUserById, updateUserById,updateMyBookListById, deleteUserById, getHglByUser} = require('./User_cosmos');
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

// get a specfic user's my book list by id
router.get('/:user_id/my_book_list', (req, res) => {
    getMyBookListOfUsersById(req, res);
});

// put(update) a specific user by id
router.put('/:user_id', (req, res) => {
    updateUserById(req, res);
});

// put(update) a specific user's my book list by id
router.put('/:user_id/my_book_list', (req, res) => {
    updateMyBookListById(req, res);
});

// delete a specific user by id
router.delete("/:user_id",(req, res)=>{
    deleteUserById(req, res);
});

//get user's highlights
router.get('/:user_id/highlights',(req, res)=>{
    getHglByUser(req,res);
})

module.exports = router;

