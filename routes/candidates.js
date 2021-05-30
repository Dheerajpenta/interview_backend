var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

var Candidate = require('../models/candidate');

router.get('/', function(req, res, next) {
  Candidate.find()
  .select('_id Name email mobile_number')
  .exec()
  .then(docs =>{
    res.status(200).send(docs);
  })
  .catch(err =>{
    res.json({Error: err});
  });
});

router.post('/', function(req, res, next) {
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

router.get('/:candidate_id', function(req, res, next) {
  const id = req.params.candidate_id;
  Candidate.findById(id)
  .select('_id Name email mobile_number')
  .exec()
  .then(doc =>{
    res.status(200).json(doc);
  })
  .catch(err =>{
    res.json({Error: err});
  });
});

router.patch('/:candidate_id', function(req, res, next) {
  const id = req.params.candidate_id;
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

router.delete('/:candidate_id', function(req, res, next) {
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

module.exports = router;
