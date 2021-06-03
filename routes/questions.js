/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");

/*const { rawListeners } = require("../app"); */

const router = express.Router();
const Question = require("../models/question");
//Get
router.get("/",paginatedResults(Question),(req,res)=>{
    res.json(res.paginatedResults);
});
// Post
router.post("/",async(req,res)=>{
    const question = new Question({
        questionID : req.body.questionID,
        questionText : req.body.questionText,
        options : req.body.options,
        marks : req.body.marks,
        difficultyLevel : req.body.difficultyLevel,
        questionType : req.body.questionType,
        correctOptions : req.body.correctOptions,
        topic: req.body.topic,
        tags: req.body.tags
    });
    try{
        const questions = await question.save() 
            .then(function (docRef) {
                res.send(docRef);
            })
            .catch(function (error) {
                res.send("Error Adding document: " + error);
            });
    }catch(err){
        res.send("Error:"+ err);
    }
});

//get by name
router.get("/:text",async(req,res)=>{
    
    try{
        console.log(req.params.text);
        Question.find({questionText: {$regex: req.params.text}}, function(e, docs){  
            res.send({ docs
            });
        });
        
      
       
    }catch(err){
        res.send("Error:"+ err);
    }
});
//Patch
router.patch("/:id",async(req,res)=>{
    
    try{
        const question = await Question.findById(req.params.id);
        question.questionID = req.body.questionID;
        question.questionText = req.body.questionText;
        question.options = req.body.options;
        question.marks = req.body.marks;
        question.difficultyLevel = req.body.difficultyLevel;
        question.questionType = req.body.questionType;
        question.correctOptions = req.body.correctOptions;
        question.topics = req.body.topics;
        question.tags = req.body.tags;
        question.UpdatedAt = Date.now();
        const question_new = await question.save()
            .then(function (docRef) {
                res.send(docRef);
            })
            .catch(function (error) {
                res.send("Error Updating document: " + error);
            });
    }catch(err){
        res.send("Error:"+ err);
    }
});
// Delete
router.delete("/:id",async(req,res)=>{
    
    try{
        const question = await Question.findById(req.params.id);
        await question.delete()
            .then(function (docRef) {
                res.send("Document Deleted");
            })
            .catch(function (error) {
                res.send("Error deleting document: " + error);
            });
        res.json(question_new);
    }catch(err){
        res.send("Error:"+ err);
    }
});

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
  
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        console.log("///////////");
        console.log(page);
        console.log(limit);
        const results = {};
  
        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page,
                limit: limit
            };
        }
      
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }
        try {

            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();
       
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}
module.exports = router;