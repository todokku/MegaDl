'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

const adapter = new FileSync('downloads.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ completed: [], queued: []})
    .write();

function isCompleted(file) {
  return !!db.get('completed')
    .find({downloadId: file.downloadId, key: file.key})
    .value();
}

function isQueued(file) {
  return !!db.get('queued')
    .find({downloadId: file.downloadId, key: file.key})
    .value();
}

module.exports = {

  getFirst: function () {
    return db.get('queued').value()[0];
  },

  getAll: function () {
    return {
      'completed': db.get('completed').value(),
      'queued': db.get('queued').value()
    }
  },

  addQueued: function (file) {
    if (isQueued(file))
      throw new Error("File Already in Queued");
    if (isCompleted(file))
      throw new Error("File Already Completed");

    file.status = 'queued';
    file.downloadedSize = 0;

    db.get('queued')
      .push(file)
      .write();
  },

  startQueued: function (file) {
    db.get('queued')
      .find({downloadId: file.downloadId, key: file.key})
      .assign({'status': 'downloading'})
      .write();
  },

  updateQueued: function (file) {
    db.get('queued')
      .find({downloadId: file.downloadId, key: file.key})
      .assign(file)
      .write();
  },

  removeQueued: function (file) {
    db.get('queued')
      .remove({downloadId: file.downloadId, key: file.key})
      .write();
  },

  removeAllQueued: function () {
    db.get('queued')
      .remove({})
      .write();
  },

  removeCompleted: function(file)
  {
    db.get('completed')
      .remove({downloadId: file.downloadId, key: file.key})
      .write();
  },

  removeAllCompleted: function() {
    db.get('completed')
      .remove({})
      .write();
  },

  completeDownload: function(file) {
    this.removeQueued(file);

    file.status = 'completed';

    db.get('completed')
      .push(file)
      .write();
  },

  errQueued: function(file) {
    file.status = 'error';
    this.updateQueued(file);
  }

};