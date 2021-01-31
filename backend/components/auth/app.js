const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const constants = require('../../constant/constant');

module.exports = {
  getNewToken(params) {
    return jwt.sign(params, constants.appTokenSecret);
  },
  verifyToken(token) {
    return jwt.verify(token, constants.appTokenSecret);
  },
  getHashByString(string) {
    return bcrypt.hashSync(string);
  },
  compareHashes(string, hashToCompare) {
    return bcrypt.compareSync(string, hashToCompare);
  },
};
