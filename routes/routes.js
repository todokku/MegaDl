'use strict';

const express = require('express');
const router = express.Router();

const mega = require('megajs');
const serializeError = require('serialize-error');
const filesize = require('filesize');

//const folder = mega.file('https://mega.nz/#F!dThwUYjD!3GAl4xzyKpVcCusKiJWrQA');

const dlCtrl = require('../controllers/DownloadCtrl');
const userCtrl = require('../controllers/UserCtrl');

const dlManager = require('../controllers/DownloadManager');

let storage = {};

if (!userCtrl.isEmpty()) {
  let options = userCtrl.getUser();
  console.log(options);
  storage = mega(options, function(err, data) {
    console.log(err);
    console.log(data);

    storage.getAccountInfo(function (err, data) {
      console.log(data);
    });
  })
}

/*const options = {
    email: 'eoin.mgr@gmail.com',
    password: 'h4om7eKMBuSe'
};*/

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});

router.post('/login', function(req, res) {
  if (!req.body || !req.body.email || !req.body.password) {
    return res.sendStatus(403);
  }

  let user = {};

  let options = {
    email: req.body.email,
    password: req.body.password
  };

  console.log(options);

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
      userCtrl.addUser({email: req.body.email, password: req.body.password});
    user.name = data.name;

    storage.getAccountInfo(function (err, data) {
      console.log(data);
      user.downloadBandwidthTotal = data.downloadBandwidthTotal;
      user.downloadBandwidthUsed = data.downloadBandwidthUsed;

      res.send(user);
    });
  });
});

router.get('/logout', function(req, res){
  storage = {};
  userCtrl.empty();
  res.sendStatus(200);
});

router.post('/load', function(req, res) {
  console.log(req.body);
  if (!req.body || !req.body.link)
    return res.sendStatus(500);

  let folder = mega.file(req.body.link);
  folder.loadAttributes((err, folder) => {
    if(err) return res.send(err);
    let simpleFolder = simplifyObject(folder);

    res.send(simpleFolder);
  });
});

router.post('/download', function(req, res) {
  let files = req.body.files;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    dlCtrl.addQueued(file);
  }
  dlManager.notify();

  res.sendStatus(200);
});

router.get('/status', function(req, res) {
  let status = dlCtrl.getAll();

  res.send(status);
});

function parentFlatten(folder) {
  if (folder.hasOwnProperty('parent')) {
    let path = parentFlatten(folder.parent);
    if(folder.directory) path.push(folder.name);
    return path;
  }

  if(folder.directory) return [folder.name];
  return [];
}

function simplifyObject(folder) {
  const props = ['name', 'size', 'directory', 'children', 'downloadId', 'key'];

  let simpleFolder = {};

  for (let i in props) {
    let p = props[i];
    simpleFolder[p] = folder[p];
  }
  simpleFolder.title = simpleFolder.name;
  simpleFolder.folder = simpleFolder.directory;
  simpleFolder.humanSize = filesize(simpleFolder.size);
  simpleFolder.bufferKey = simpleFolder.key;

  simpleFolder.downloadFolder = parentFlatten(folder);

  if (simpleFolder.children) {
    for (let i = 0; i < simpleFolder.children.length; i++) {
        simpleFolder.children[i] = simplifyObject(simpleFolder.children[i]);
    }
  }

  return simpleFolder;
}

module.exports = router;
