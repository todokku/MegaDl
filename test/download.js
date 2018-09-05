let dlCtrl = require('../controllers/DownloadCtrl');
let assert = require('assert');

let testFile = {
  "name": "01 The Dark Hand.mp4",
  "size": 149342466,
  "directory": false,
  "downloadId": [
    "8fYnkZxT",
    "pa51xISR"
  ],
  "key": {
    "type": "Buffer",
    "data": [139, 127, 109, 12, 218, 74, 40, 140, 123, 98, 32, 77, 119, 182, 13, 200, 102, 201, 191, 93, 199, 88, 21, 206, 160, 127, 190, 143, 238, 252, 193, 80]
  }
};

let testFileCopy = {
  "name": "01 The Dark Hand.mp4",
  "size": 149342466,
  "directory": false,
  "downloadId": [
    "8fYnkZxT",
    "pa51xISR"
  ],
  "key": {
    "type": "Buffer",
    "data": [139, 127, 109, 12, 218, 74, 40, 140, 123, 98, 32, 77, 119, 182, 13, 200, 102, 201, 191, 93, 199, 88, 21, 206, 160, 127, 190, 143, 238, 252, 193, 80]
  }
};

describe('download db', function() {
  before('Setting up empty db', function(done) {
    dlCtrl.removeAllQueued(testFile);
    dlCtrl.removeAllCompleted();

    dlCtrl.addQueued(testFile);

    done();
  });

  it('getAll(): 1 queued item', function(done) {
    let value = dlCtrl.getAll();
    assert.deepEqual(value, {completed: [], queued: [testFile]});
    done()
  });

  it('update queued item with started value', function(done) {
    testFile.started = true;
    dlCtrl.updateQueued(testFile);
    let value = dlCtrl.getAll();
    assert.deepEqual(value, {completed: [], queued: [testFile]});
    done();
  });

  it('insert existing value in queued', function(done) {
    assert.throws(() => { dlCtrl.addQueued(testFileCopy) }, Error, "File Already in Queue");
    done();
  });

  it('completed download, getAll', function(done) {
    dlCtrl.completeDownload(testFile);
    let value = dlCtrl.getAll();
    assert.deepEqual(value, {completed: [testFile], queued: []});
    done();
  });

  it('insert existing value in completed', function(done) {
    assert.throws(() => { dlCtrl.addQueued(testFileCopy) }, Error, "File Already in Completed");
    done();
  });

  it('empty db', function(done) {
    dlCtrl.removeAllQueued();
    dlCtrl.removeAllCompleted();
    let value = dlCtrl.getAll();
    assert.deepEqual(value, {completed: [], queued: []});
    done();
  });

});