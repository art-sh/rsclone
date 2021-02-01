const router = require('express').Router();
const modelUser = require('../../models/User');
const auth = require('../auth/app');
const mixin = require('../../helpers/mixin');

router.post('/login', (req, res) => {
  if (req.headers['app-token']) return mixin.jsonBad({message: 'You are already logged in'}, 400, res);
  if (!req.body.password) return mixin.jsonBad({message: 'Password is empty'}, 400, res);

  const cb = (result) => {
    if (result.error || !result.result.length) return mixin.jsonBad({message: 'Not found'}, 400, res);

    if (!auth.compareHashes(req.body.password, result.result[0].password)) {
      return mixin.jsonBad({message: 'Login or password mismatch'}, 400, res);
    }

    const outModel = {...result.result[0]};
    delete outModel.password;

    res
      .header('Access-Control-Expose-Headers', 'App-Token')
      .header('App-Token', auth.getNewToken({_login: result.result[0].login}))
      .send(mixin.jsonOk(outModel));
  };

  modelUser.findByLogin(req.body.login, cb);
});

router.post('/register', (req, res) => {
  if (req.headers['app-token']) return mixin.jsonBad({message: 'You are already registered'}, 400, res);
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

    const outModel = {...modelFields};
    delete outModel.password;

    res
      .header('Access-Control-Expose-Headers', 'App-Token')
      .header('App-Token', auth.getNewToken({_login: result.result[0].login}))
      .json(mixin.jsonOk(outModel));
  };

  modelUser.write(modelFields, cb);
});

module.exports = router;
