const express = require('express');
const {getTextAnalyticsData } = require('../helpers/cognitiveAPI');
const {putEmotionCount} = require('../routes/Book_cosmos');
const { getHglByBook, getallhighlights, getHglById, postHgl, deleteHgl, deleteHglLike, editHglmemo,getAnnotByBook, getHglByBookWithScope } = require('./Highlight_cosmos');
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
    // req.body.memo의 값을 감정분석 API로 전송하여 결과값을 얻고, 그 결과를 함께 저장. 
    // 1. REST API 요청을 통해 감정분석 결과 받아옴
    getTextAnalyticsData(req,res).then((respond) => {
        let emotion = respond;
        req.body.emotion = emotion;
        editHglmemo(req,res);
        putEmotionCount(req, res);
    });
    // 2. 해당결과를 이용하여 Highlight Memo 정보에 감정 분석 수치 업데이트 
    // 3. Book의 감정 Count 값 갯수 추가 - putEmotionCount
    // 주소 url: https://renosh-text-analytics.cognitiveservices.azure.com/
    // header
    // Content-Type : 
    // Ocp-Apim-Subscription-key : 
      //Highlight 및 Annotation 정보를 서버로 전송 
})

router.get("/book/:book_id/:scope", (req, res)=>{
    getHglByBookWithScope(req,res);
})
module.exports = router;