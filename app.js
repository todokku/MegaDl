'use strict';

const webpack_config = require('./webpack.config');

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack(webpack_config);

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const router = require('./routes/routes');

const app = express();

app.use(logger('dev'));
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
