'use strict';

const fs = require('fs');
const mega = require('megajs');
const path = require('path');
const mkdirp = require('mkdirp');

const dlCtrl = require('../controllers/DownloadCtrl');

const loc = './downloads';

let active = undefined;

function initialize() {
  nextDl();
}

function nextDl() {
  active = dlCtrl.getFirst();
  if(active) download();
}

function download() {
  active.key = Buffer.from(active.bufferKey);

  let file = new mega.File(active);
  console.log(file);

  let dlFolder = path.resolve.apply(null, [loc].concat(active.downloadFolder));
  console.log(dlFolder);
  mkdirp(dlFolder, function (err) {
    if (err) return console.log(err);

    let stream = file.download();
    stream.pipe(fs.createWriteStream(path.resolve(dlFolder, active.name)));

    stream.on('data', (chunk) => {
      console.log(`Received ${chunk.length} bytes of data.`);
      active.downloadedSize += chunk.length;
      dlCtrl.updateQueued(active);
    });
    stream.on('end', () => {
      console.log('There will be no more data.');
      dlCtrl.completeDownload(active);
      active = undefined;
      nextDl();
    });
    stream.on('err', (err) => {
      console.log('ERROR');
      console.log(err);
      dlCtrl.errQueued(active);
      active = undefined;
      nextDl();
    });
  });
}

initialize();

module.exports = {
  notify: function() {
    if(!active) nextDl();
  }
};