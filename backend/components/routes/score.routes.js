const router = require('express').Router();
const modelUser = require('../../models/User');
const modelScore = require('../../models/Score');
const auth = require('../auth/app');
const mixin = require('../../helpers/mixin');

router.get('/get-all', (req, res) => {
  const userLogin = auth.getUserLoginByToken(req.headers['app-token']);

  if (!userLogin) return mixin.jsonBad({message: 'Forbidden'}, 403, res);

  const cb = (result) => {
    if (result.error || !result.result.length) return mixin.jsonBad({message: 'Not found'}, 400, res);

    const scoreSummary = {};
    const user = result.result[0];
    const searchCallback = (searchResults) => {
      if (searchResults.error) return mixin.jsonBad({message: 'Bad search results'}, 400, res);

      searchResults.result.forEach((searchResult) => {
        const gameId = searchResult.game_id;

        if (scoreSummary[gameId] === undefined) {
          scoreSummary[gameId] = {
            best: 0,
            overall: 0,
          };
        }

        scoreSummary[gameId].overall += +searchResult.score;
        scoreSummary[gameId].best = Math.max(scoreSummary[gameId].best, +searchResult.score);
      });

      mixin.jsonOk(scoreSummary, res);
    };

    modelScore.findAllByUserId(user.id, searchCallback);
  };

  modelUser.findByLogin(userLogin, cb);
});

router.post('/submit-result', (req, res) => {
  const userLogin = auth.getUserLoginByToken(req.headers['app-token']);

  if (!userLogin) return mixin.jsonBad({message: 'Forbidden'}, 403, res);
  if (!req.body || !req.body.game_id || !req.body.score) return mixin.jsonBad({message: 'Missed required params game_id or score'}, 400, res);

  const cb = (result) => {
    if (result.error || !result.result.length) return mixin.jsonBad({message: 'Not found'}, 400, res);

    const user = result.result[0];
    const score = {
      id: null,
      game_id: req.body.game_id,
      user_id: user.id,
      score: req.body.score,
    };
    const insertCallback = (insertResult) => {
      if (insertResult.error) return mixin.jsonBad({message: 'Error saving in db'}, 400, res);

      score.id = insertResult.result.insertId;

      mixin.jsonOk({model: score}, res);
    };

    modelScore.insert(score, insertCallback);
  };

  modelUser.findByLogin(userLogin, cb);
});

module.exports = router;
