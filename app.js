'use strict';

const webpack_config = require('./webpack.config');

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack(webpack_config);

const express = require('express');
const path = require('path');
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

app.use(middleware(compiler, {
  // webpack-dev-middleware options
  writeToDisk: true
}));

app.use('/', router);

module.exports = app;
