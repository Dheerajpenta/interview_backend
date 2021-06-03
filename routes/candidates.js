/* eslint-disable no-unused-vars */
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const candidate = require("../models/candidate");
var Candidate = require("../models/candidate");

router.get("/",paginatedResults(Candidate),(req,res)=>{
    res.json(res.paginatedResults);
});

router.post("/", function(req, res, next) {
    const candidate = new Candidate({
        _id: new mongoose.Types.ObjectId(),
        Name: req.body.Name,
        email: req.body.email,
        mobile_number: req.body.mobile_number
    });
    candidate.save()
        .then(result => {
            res.status(201).json({
                message: "Created new Candidate",
                candidate: {
                    Name: result.Name,
                    email: result.email,
                    mobile_number: result.mobile_number
                }
            });
        })
        .catch(err =>{
            res.json({Error: err});
        });
});

router.get("/:candidate_id", function(req, res, next) {
    const id = req.params.candidate_id;
    Candidate.findById(id)
        .select("_id Name email mobile_number")
        .exec()
        .then(doc =>{
            res.status(200).json(doc);
        })
        .catch(err =>{
            res.json({Error: err});
        });
});

router.patch("/:candidate_id", function(req, res, next) {
    const id = req.params.candidate_id;
    Candidate.findById(id, function(err, candidate) {
        candidate.Name = req.body.Name;
        candidate.email = req.body.email;
        candidate.mobile_number = req.body.mobile_number;
        candidate.save()
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

router.delete("/:candidate_id", function(req, res, next) {
    const id = req.params.candidate_id;
    Candidate.deleteOne({_id: id})
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
