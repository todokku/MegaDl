'use strict';

const express = require('express');

const path = require('path');
global.__basedir = path.resolve(__dirname);

const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream');

const router = require('./routes/routes');

const app = express();

const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const logStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

app.use(logger('common', {
  skip: function (req, res) {
    if (req.url === '/status')
      return true;
    else
      return false;
  },
  stream: logStream
}));

app.use(logger('dev', {
  skip: function (req, res) {
    if (req.url === '/status')
      return true;
    else
      return false;
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

const server = app.listen(8081, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)
});

module.exports = app;
