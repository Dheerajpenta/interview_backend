/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var Skill = require("../models/skill");

router.get("/",paginatedResults(Skill),(req,res)=>{
    res.json(res.paginatedResults);
});

router.post("/", function(req, res, next) {
    const skill= new Skill({
        _id: new mongoose.Types.ObjectId(),
        skillName: req.body.skillName
    });
    skill.save()
        .then(result => {
            res.status(201).json({
                message: "new skill added",
                skill: {
                    skillName: result.skillName
                }
            });
        })
        .catch(err =>{
            res.json({Error: err});
        });
});

router.get("/:skill_id", function(req, res, next) {
    const id = req.params.skill_id;
    Skill.findById(id)
        .select("_id skillName")
        .exec()
        .then(doc =>{
            res.status(200).json(doc);
        })
        .catch(err =>{
            res.json({Error: err});
        });
});

router.patch("/:skill_id", function(req, res, next) {
    const id = req.params.skill_id;
    Skill.findById(id, function(err, skill) {
        skill.skillName = req.body.skillName;
        skill.save()
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

router.delete("/:skill_id", function(req, res, next) {
    const id = req.params.skill_id;
    Skill.deleteOne({_id: id})
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
