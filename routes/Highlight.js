const express = require('express');
const {getTextAnalyticsData } = require('../helpers/cognitiveAPI');
const {putEmotionCount} = require('../routes/Book_cosmos');
const { getHglByBook, getallhighlights, getHglById, increaseBookHgl, postHgl, deleteHgl, deleteHglLike, editHglmemo,getAnnotByBook, getHglByBookWithScope } = require('./Highlight_cosmos');
const router = express.Router();

//get highlights and annotations of the book
router.get("/book/:book_id/", (req, res)=>{
    getHglByBook(req,res);
})

//get annotations of the book
router.get("/book/:book_id/memo",(req,res)=>{
    getAnnotByBook(req,res);
})

//post a highlight on the book
router.post("/book/:book_id",(req, res)=>{
    increaseBookHgl(req,res);
    postHgl(req, res);  
})

//get a highlight by id
router.get('/:book_id/:highlight_id',(req, res)=>{
    getHglById(req,res);
})

//delete a highlight
router.delete('/:book_id/:highlight_id',(req, res)=>{
    //delete a highlight item from bookbinder container
    deleteHgl(req,res);
    //delete the highlight from all user's like list (CASCADE DELETE)
    deleteHglLike(req,res);
})

//edit highlight memo
router.put('/:book_id/:highlight_id',(req,res)=>{
    getTextAnalyticsData(req,res).then((respond) => {
        let emotion = respond;
        req.body.emotion = emotion;
        putEmotionCount(req, res);
        editHglmemo(req,res);
    });
})

router.get("/book/:book_id/:scope", (req, res)=>{
    getHglByBookWithScope(req,res);
})
module.exports = router;