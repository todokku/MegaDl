'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

router.use('/user', require('./user'));
router.use('/download', require('./download'));

module.exports = router;
