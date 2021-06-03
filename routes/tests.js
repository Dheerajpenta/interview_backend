/* eslint-disable no-unused-vars */
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var Test = require("../models/test");

router.get("/",paginatedResults(Test),(req,res)=>{
    res.json(res.paginatedResults);
});

router.post("/", function(req, res, next) {
    const test = new Test({
        test_id: new mongoose.Types.ObjectId(),
        Questions_id: req.body.Questions_id,
        Name: req.body.Name,
        Role: req.body.Role,
        Duration: req.body.Duration,
        Description: req.body.Description,
        Expires_at: req.body.Expires_at,
        Status: req.body.Status
    });
    test.save()
        .then(result => {
            res.status(201).json({
                message: "Created new test",
                test: {
                    Questions_id: result.Questions_id,
                    Name: result.Name,
                    Role: result.Role,
                    Duration: result.Duration,
                    Description: result.Description,
                    Expires_at: result.Expires_at,
                    Status: result.Status
                }
            });
        })
        .catch(err =>{
            res.json({Error: err});
        });
});

router.get("/:test_id", function(req, res, next) {
    const id = req.params.test_id;
    Test.findById(id)
        .select("Questions_id Name Role Duration Description Expires_at Status")
        .exec()
        .then(doc =>{
            res.status(200).json(doc);
        })
        .catch(err =>{
            res.json({Error: err});
        });
});

router.patch("/:test_id", function(req, res, next) {
    const id = req.params.test_id;
    Test.findById(id, function(err, test) {
        test.Questions_id = req.body.Questions_id;
        test.Name = req.body.Name;
        test.Role = req.body.Role;
        test.Duration = req.body.Duration;
        test.Description = req.body.Description;
        test.Expires_at = req.body.Expires_at;
        test.Status = req.body.Status;        
        test.save()
            .then(
                res.status(200).json({
                    message: "updated"
                })
            )
            .catch(err =>{
                res.json({Error: err});
            });
    });
});

router.delete("/:test_id", function(req, res, next) {
    const id = req.params.test_id;
    Test.deleteOne({_id: id})
        .exec()
        .then(res.status(200).json({
            message: "Deleted"
        }))
        .catch(err =>{
            res.json({Error: err});
        });
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
