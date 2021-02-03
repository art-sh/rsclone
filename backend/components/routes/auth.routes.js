const router = require('express').Router();
const modelUser = require('../../models/User');
const auth = require('../auth/app');
const mixin = require('../../helpers/mixin');

router.post('/login', (req, res) => {
  if (!req.body) return mixin.jsonBad({message: 'Bad form data'}, 400, res);
  if (!req.body.login) return mixin.jsonBad({message: 'Login is empty'}, 400, res);
  if (!req.body.password) return mixin.jsonBad({message: 'Password is empty'}, 400, res);

  const cb = (result) => {
    if (result.error || !result.result.length) return mixin.jsonBad({message: 'User with this login does not exists'}, 400, res);

    if (!auth.compareHashes(req.body.password, result.result[0].password)) {
      return mixin.jsonBad({message: 'Login or password mismatch'}, 400, res);
    }

    const outModel = {...result.result[0]};
    delete outModel.password;

    res
      .header('App-Token', auth.getNewToken({_login: result.result[0].login}))
      .json(mixin.jsonOk(outModel));
  };

  modelUser.findByLogin(req.body.login, cb);
});

router.post('/register', (req, res) => {
  if (req.headers['app-token']) return mixin.jsonBad({message: 'You are already registered'}, 400, res);
  if (!req.body) return mixin.jsonBad({message: 'Bad form data'}, 400, res);
  if (!req.body.login || req.body.login.length < 5 || req.body.login.length > 20) return mixin.jsonBad({message: 'Login must be between 5 and 20 chars'}, 400, res);
  if (!req.body.password || req.body.password.length < 8 || req.body.password.length > 64) return mixin.jsonBad({message: 'Password must be between 8 and 64 chars'}, 400, res);

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const modelFields = {
    login: req.body.login,
    password: auth.getHashByString(req.body.password),
    name: req.body.name || `SuperUser ${currentTimestamp}`,
    date_create: currentTimestamp,
  };

  const cb = (result) => {
    if (result.error) return mixin.jsonBad({message: 'That login is busy'}, 400, res);

    const outModel = {...modelFields};
    outModel.id = result.result.insertId;
    delete outModel.password;

    res
      .header('App-Token', auth.getNewToken({_login: req.body.login}))
      .json(mixin.jsonOk(outModel));
  };

  modelUser.write(modelFields, cb);
});

module.exports = router;
