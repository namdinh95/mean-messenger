var express = require('express');
var router = express.Router();

var Message = require('../models/message');

router.post('/', (req, res, next) => {
  var message = new Message({content: req.body.content});
  message.save((err, result) => {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    res.status(201).json({
      message: 'Message saved',
      obj: result
    });
  });
});

module.exports = router;
