'use strict';

const fs = require('fs');
const mega = require('megajs');
const path = require('path');
const mkdirp = require('mkdirp');
const progress = require('progress-stream');
const filesize = require('filesize');

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
  const dlDirectory = path.resolve.apply(null, [loc].concat(active.downloadFolder));
  const dlFullPath = path.resolve(dlDirectory, active.name);

  let startByte = 0;
  if (active.status !== 'downloading')
    dlCtrl.startQueued(active);
  else {
    if (fs.existsSync(dlFullPath)) {
      startByte = fs.statSync(dlFullPath).size;
    }
  }
  active.downloadedSize = startByte;
  dlCtrl.updateQueued(active);

  let file = new mega.File(active);

  mkdirp(dlDirectory, function (err) {
    if (err) return console.log(err);

    let prog = progress({
      time: 1000,
      length: active.size,
      transferred: startByte
    });

    prog.on('progress', function(progress) {
      progress.percentage = +progress.percentage.toFixed(2);
      console.log(progress);
    });

    let stream = file.download({start: startByte});
    stream.pipe(prog).pipe(fs.createWriteStream(dlFullPath, {
      flags: startByte === 0 ? 'w' : 'a',
      startByte
    }));

    stream.on('data', (chunk) => {
      //console.log(`Received ${chunk.length} bytes of data.`);
      active.downloadedSize += chunk.length;
      active.humanDownloadedSize = filesize(active.downloadedSize);
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