var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

var Skill = require('../models/skill');

router.get('/', function(req, res, next) {
 Skill.find()
  .select('_id skillName')
  .exec()
  .then(docs =>{
    res.status(200).send(docs);
  })
  .catch(err =>{
    res.json({Error: err});
  });
});

router.post('/', function(req, res, next) {
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

router.get('/:skill_id', function(req, res, next) {
  const id = req.params.skill_id;
  Skill.findById(id)
  .select('_id skillName')
  .exec()
  .then(doc =>{
    res.status(200).json(doc);
  })
  .catch(err =>{
    res.json({Error: err});
  });
});

router.patch('/:skill_id', function(req, res, next) {
  const id = req.params.skill_id;
  const update_operations = {};
  for (const ops of req.body) {
    update_operations[ops.propname] = ops.value;
  }
  Candidate.updateOne({_id: id}, {$set: update_operations})
  .exec()
  .then(res.status(200).json({
    message: "Updated"
  }));
});

router.delete('/:skill_id', function(req, res, next) {
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

module.exports = router;
