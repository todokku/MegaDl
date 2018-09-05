let userCtrl = require('../controllers/UserCtrl');
let assert = require('assert');

const testUser = {
  email: 'test@test.nz',
  password: 'testpass'
};

describe('user db', function() {
  before('Setting up empty db', function (done) {
    userCtrl.empty();
    done();
  });

  it('should be empty db', function (done) {
    let value = userCtrl.getUser();
    assert.deepEqual(value, {});
    assert.equal(true, userCtrl.isEmpty());
    done()
  });

  it('add user', function (done) {
    userCtrl.addUser(testUser);
    assert.equal(false, userCtrl.isEmpty());
    let value = userCtrl.getUser();
    assert.deepEqual(value, testUser);
    done()
  });

  after('Finish with empty db', function(done) {
    userCtrl.empty();
    done();
  });

});