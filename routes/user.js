'use strict';

const express = require('express');
const router = express.Router();

const mega = require('megajs');
const serializeError = require('serialize-error');

const userCtrl = require('../controllers/UserCtrl');
let storage = {};

// Initialise storage object on server start if user exists in db
if (!userCtrl.isEmpty()) {
  let options = userCtrl.getUser();
  console.log(options);
  storage = mega(options, function(err, data) {
    //console.log(err);
    //console.log(data);
  })
}

/*const options = {
    email: 'eoin.mgr@gmail.com',
    password: 'h4om7eKMBuSe'
};*/

router.post('/login', function(req, res) {
  if (!req.body || !req.body.email || !req.body.password) {
    return res.sendStatus(403);
  }

  let user = {};

  let options = {
    email: req.body.email,
    password: req.body.password
  };

  storage = mega(options, function(err, data) {
    console.log(data);

    if (err) {
      err = serializeError(err);
      console.log(err);
      if (err.code === 'ENOTFOUND') {
        err.errcode = 503;
        err.errmsg = 'Service Unavailable';
      }
      else if (err.message.includes("Wrong password")) {
        err.errcode = 401;
        err.errmsg = 'Wrong Email/Password';
        console.log(err);
      }
      else if (err.message.includes("ETOOMANY")) {
        err.errcode = 429;
        err.errmsg = 'Too Many Attempts';
        console.log(err);
      }
      else {
        err.errcode = 500;
        err.errmsg = 'Unknown Error';
      }
      return res.status(err.errcode).send(err);
    }
    if(req.body.remember)
      userCtrl.addUser({email: req.body.email, password: req.body.password, name: data.name});
    user.name = data.name;
    res.send(user);
  });
});

router.get('/logout', function(req, res){
  storage = {};
  userCtrl.empty();
  res.sendStatus(200);
});

router.get('/loggedin', function(req, res) {
  if (!userCtrl.isEmpty())
    res.send({name: userCtrl.getUser().name});
  else
    res.send({})
});

router.get('/accountinfo', function(req, res) {
  if(!storage) return res.sendStatus(412);

  let user = {};
  storage.getAccountInfo(function (err, data) {
    if(err) return res.send(err);

    console.log(data);
    user.downloadBandwidthTotal = data.downloadBandwidthTotal;
    user.downloadBandwidthUsed = data.downloadBandwidthUsed;

    return res.send(user);
  });
});

module.exports = router;
