const express = require('express');
const { getMyBookListOfUsersById,updateMyBookListById} = require('./UserBookList_cosmos');
const router = express.Router();

// get a specfic user's my book list by user id
router.get('/:userid/mybooklist', (req, res) => {
    getMyBookListOfUsersById(req, res);
});

// put(update) a specific user's my book list by id
router.put('/:userid/mybooklist', (req, res) => {
    updateMyBookListById(req, res);
});

module.exports = router;