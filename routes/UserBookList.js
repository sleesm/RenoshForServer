const express = require('express');
const { getUserBookListByUserId, getMyBookListOfUsersByUserId,postMyBookListOfUsersById, updateMyBookListById, updateMyBookLastRead} = require('./UserBookList_cosmos');
const router = express.Router();

// get a specfic user's userbooklist filed by user id
router.get('/:userid', (req, res) => {
    getUserBookListByUserId(req, res);
});

// get a specfic user's my book list by user id
router.get('/:userid/mybooklist', (req, res) => {
    getMyBookListOfUsersByUserId(req, res);
});

// create my book list when first 'startReading' clicked
router.post('/:userid', (req, res) => {
    postMyBookListOfUsersById(req, res);
});

// put(update) a specific user's my book list by id
router.put('/:userid/:userbooklistid/mybooklist', (req, res) => {
    updateMyBookListById(req, res);
});

// put(update) a specific user's my book list by id
router.put('/:userid/:userbooklistid/lastRead', (req, res) => {
    updateMyBookLastRead(req, res);
});

module.exports = router;