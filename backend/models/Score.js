const db = require('../components/database/app');

const Score = {
  insert(obj, insertCallback) {
    const queryCallback = (err, result) => {
      if (result) delete result.password;

      insertCallback({
        error: (err) ? err.sqlMessage : null,
        result,
      });
    };

    db.query('INSERT INTO score(`game_id`, `user_id`, `score`) VALUES (?, ?, ?)', [obj.game_id, obj.user_id, obj.score], queryCallback);
  },
  findAllByUserId(userId, searchCallback) {
    const queryCallback = (err, result) => {
      if (result) delete result.password;

      searchCallback({
        error: (err) ? err.sqlMessage : null,
        result,
      });
    };

    db.query('SELECT * FROM score WHERE user_id = ?', [userId], queryCallback);
  },
};

module.exports = Score;
