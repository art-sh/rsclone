const router = require('express').Router();
const modelUser = require('../../models/User');
const auth = require('../auth/app');
const mixin = require('../../helpers/mixin');

router.post('/login', (req, res) => {
  if (req.headers.AppToken) return mixin.jsonBad({message: 'You are already logged in'}, 400, res);
  if (!req.body.password) return mixin.jsonBad({message: 'Password is empty'}, 400, res);

  const cb = (result) => {
    if (result.error || !result.result.length) return mixin.jsonBad({message: 'Not found'}, 400, res);

    if (!auth.compareHashes(req.body.password, result.result[0].password)) {
      return mixin.jsonBad({message: 'Login or password mismatch'}, 400, res);
    }

    res
      .header('AppToken', auth.getNewToken({_id: result.result.login}))
      .send(mixin.jsonOk({message: 'Success authenticated'}));
  };

  modelUser.findByLogin(req.body.login || '', cb);
});

router.post('/register', (req, res) => {
  if (req.headers.AppToken) return mixin.jsonBad({message: 'You are already registered'}, 400, res);
  if (!req.body) return mixin.jsonBad({message: 'Bad form data'}, 400, res);

  const modelFields = {
    login: req.body.login,
    password: auth.getHashByString(req.body.password),
    name: req.body.name,
    date_create: Math.floor(Date.now() / 1000),
  };

  const modelValidate = modelUser.validate(modelFields);
  if (modelValidate.hasErrors()) return mixin.jsonBad(modelValidate, 400, res);

  const cb = (result) => {
    if (result.error) return mixin.jsonBad({message: 'That login is busy'}, 400, res);

    res
      .header('App-Token', auth.getNewToken({_id: result.result.login}))
      .json(mixin.jsonOk({message: 'Success registered'}));
  };

  modelUser.write(modelFields, cb);
});

module.exports = router;
