const express = require('express');
const { getHglByBook, getallhighlights, getHglById, postHgl, deleteHgl } = require('./Highlight_cosmos');
const router = express.Router();


//get highlights of the book
router.get("/book/:book_id", (req, res)=>{
    getHglByBook(req,res);
})

//post a highlight on the book
router.post("/book/:book_id",(req, res)=>{
    postHgl(req, res);
})

//get a highlight by id
router.get('/:highlight_id',(req, res)=>{
    getHglById(req,res);
})


//delete a highlight by id
router.delete('/:highlight_id',(req, res)=>{
    deleteHgl(req,res);
})

module.exports = router;