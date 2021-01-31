const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const constants = require('../../constant/constant');

module.exports = {
  getNewToken(params) {
    return jwt.sign(params, constants.appTokenSecret);
  },
  verifyToken(token) {
    try {
      return jwt.verify(token, constants.appTokenSecret);
    } catch (e) {
      return false;
    }
  },
  getHashByString(string) {
    return bcrypt.hashSync(string);
  },
  compareHashes(string, hashToCompare) {
    return bcrypt.compareSync(string, hashToCompare);
  },
  getUserLoginByToken(token) {
    if (!token) return false;

    const tokenParsed = this.verifyToken(token);
    if (!tokenParsed || !tokenParsed._login) return false;

    return tokenParsed._login;
  },
};
