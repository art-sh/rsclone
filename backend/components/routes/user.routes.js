const router = require('express').Router();
const modelUser = require('../../models/User');
const auth = require('../auth/app');
const mixin = require('../../helpers/mixin');

router.put('/change-password', (req, res) => {
  const userLogin = auth.getUserLoginByToken(req.headers['app-token']);

  if (!userLogin) return mixin.jsonBad({message: 'Forbidden'}, 403, res);
  if (!req.body || !req.body.password || req.body.password.length < 8 || req.body.password.length > 64) return mixin.jsonBad({message: 'Bad new password'}, 400, res);

  const newPassword = auth.getHashByString(req.body.password);
  const cb = (result) => {
    if (result.error || !result.result.length) return mixin.jsonBad({message: 'User not found'}, 400, res);

    const outModel = {...result.result[0]};
    delete outModel.password;

    const cbUpdate = (updateResult) => {
      if (updateResult.error) return mixin.jsonBad({message: 'Changing password is not completed'}, 400, res);

      mixin.jsonOk(outModel, res);
    };

    modelUser.updateField(userLogin, 'password', newPassword, cbUpdate);
  };

  modelUser.findByLogin(userLogin, cb);
});

router.put('/change-name', (req, res) => {
  const userLogin = auth.getUserLoginByToken(req.headers['app-token']);

  if (!userLogin) return mixin.jsonBad({message: 'Forbidden'}, 403, res);
  if (!req.body || !req.body.name) return mixin.jsonBad({message: 'Bad new name'}, 400, res);

  const cb = (result) => {
    if (result.error || !result.result.length) return mixin.jsonBad({message: 'User not found'}, 400, res);

    const outModel = {...result.result[0]};
    delete outModel.password;

    const cbUpdate = (updateResult) => {
      if (updateResult.error) return mixin.jsonBad({message: 'Changing name is not completed'}, 400, res);

      outModel.name = req.body.name;

      mixin.jsonOk(outModel, res);
    };

    modelUser.updateField(userLogin, 'name', req.body.name, cbUpdate);
  };

  modelUser.findByLogin(userLogin, cb);
});

module.exports = router;
