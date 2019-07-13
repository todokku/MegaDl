'use strict';

const express = require('express');
const router = express.Router();

const mega = require('megajs');
const filesize = require('filesize');

//const folder = mega.file('https://mega.nz/#F!dThwUYjD!3GAl4xzyKpVcCusKiJWrQA');

const dlCtrl = require('../controllers/DownloadCtrl');

const dlManager = require('../controllers/DownloadManager');

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

router.post('/add', function(req, res) {
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
