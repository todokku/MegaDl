'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('user.json');
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