'use strict';

const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

const __db_folder = path.join(global.__basedir, 'database');

// Create database folder if it doesn't already exist
if (!fs.existsSync(__db_folder)){
  fs.mkdirSync(__db_folder);
}

const adapter = new FileSync(path.join(__db_folder, 'user.json'));
const db = low(adapter);

db.defaults({})
  .write();

module.exports = {
  addUser: function(user) {
    db.setState(user).write();
  },

  getUser: function() {
    return db.getState();
  },

  empty: function() {
    db.setState({}).write();
  },

  isEmpty: function() {
    return db.isEmpty().value();
  }
};