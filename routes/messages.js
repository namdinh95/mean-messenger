var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Message = require('../models/message');

router.get('/', (req, res, next) => {
  Message.find()
    .exec((err, messages) => {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        obj: messages
      });
    });
});

// Check token validity before processing any of the below request
router.use('/', (req, res, next) => {
  jwt.verify(req.query.token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({
        title: 'Not Authenticated', 
        error: err
      });
    }
    next(); // Go on with intended request
  });
});

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
router.patch('/:id', (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    if (!message) {
      return res.status(500).json({
        title: 'Message Not Found',
        error: {message: 'Message not found'}
      });
    }
    message.content = req.body.content;
    message.save((err, result) => {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        message: 'Updated message',
        obj: result
      });
    });
  });
});
router.delete('/:id', (req, res, next) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    if (!message) {
      return res.status(500).json({
        title: 'Message Not Found',
        error: {message: 'Message not found'}
      });
    }
    message.remove((err, result) => {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        message: 'Deleted message',
        obj: result
      });
    });
  });
});

module.exports = router;
