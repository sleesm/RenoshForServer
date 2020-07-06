const express = require('express');
const { getHglByBook, getallhighlights, getHglById, postHgl } = require('./Highlight_cosmos');
const router = express.Router();

//get highlights of the book
router.get("/book/:book_id", (req, res)=>{
    // res.send(`highlights of the book ${req.params.book_id}`);
    getHglByBook(req,res);
})

//post a highlight on the book
router.post("/book/:book_id",(req, res)=>{
    postHgl(req, res);
    //res.send(`create highlight on book ${req.params.book_id}`);
})

//get a highlight by id
router.get('/:highlight_id',(req, res)=>{
    getHglById(req,res);
})


//delete a highlight by id
router.delete('/:highlight_id',(req, res)=>{
    // res.json({
    //     "highlight_id":highlight_id
    // })
    res.send(`delete num ${req.params.highlight_id}`);
})

module.exports = router;