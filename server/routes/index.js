const express = require('express');
const path = require('path');
const request = require('request');
const router = express.Router();
const cors = require('cors');
const config = require('../../config.json');

const corsOptions = {
  origin: config.server.url,
  optionsSuccessStatus: 200
}

/* GET home page. */
// router.post('/postMessage', cors(corsOptions), function(req, res, next) {
router.post('/postMessage', function(req, res, next) {
  const { message, type } = req.body;
  if(message === undefined) {
    res.status(500);
    res.json({ message: 'message must be defined in request body' });
    return;
  }

  request.post({
    url: `${config.api.url}/api/HackGT4/${type}`,
    body: {message: {data: message}},
    json: true,
    auth: { user: config.api.user, pass: config.api.pass }
  }, (err, response) => {
    if(err) {
      res.status(500);
      res.json({ message: 'API resulted in an error', err });
    } else {
      if(response.statusCode===401) {
        res.status(500);
        res.json({ message: 'API Key not set properly' });
        return;
      }
      res.json({ message: 'Success', response });
    }
  });
});

module.exports = router;
