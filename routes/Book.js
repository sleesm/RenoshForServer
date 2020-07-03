const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('list of books');
})

router.get('/:bookid', (req, res)=>{
    res.send(`a book. id: ${req.params.bookid}`);
})

module.exports = router;