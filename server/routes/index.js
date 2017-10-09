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
router.post('/postMessage', function (req, res, next) {


  // Handle API Token Auth
  const auth = req.headers.authorization;
  if (!auth) {
    res.statusCode = 401;
    res.end('Unauthorized');
    return;
  }
  let parts;
  if (typeof auth == 'string')
    parts = auth.split(' ');
  else if (Array.isArray(auth))
    parts = auth[0];

  if (parts.length !== 2) return res.sendStatus(400);

  const scheme = parts[0];
  const credentials = new Buffer(parts[1], 'base64').toString();
  const index = credentials.indexOf(':');

  if ('Basic' != scheme || index < 0) return res.sendStatus(400);

  const user = credentials.slice(0, index);
  const pass = credentials.slice(index + 1);

  if (user !== process.env.user || pass !== process.env.password) {
    res.statusCode = 401;
    res.end('Unauthorized');
  }

  const {
    message,
    type
  } = req.body;

  if (message === undefined) {
    res.status(500);
    res.json({
      message: 'message must be defined in request body'
    });
    return;
  }

  request.post({
    url: `${config.api.url}/api/HackGT4/${type}`,
    body: {
      message: {
        data: message
      }
    },
    json: true,
    auth: {
      user: process.env.api_id,
      pass: process.env.api_secret
    }
  }, (err, response) => {
    if (err) {
      res.status(500);
      res.json({
        message: 'API resulted in an error',
        err
      });
    } else {
      if (response.statusCode === 401) {
        res.status(500);
        res.json({
          message: 'API Key not set properly'
        });
        return;
      }
      res.json({
        message: 'Success',
        response
      });
    }
  });
});

module.exports = router;