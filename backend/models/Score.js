const db = require('../components/database/app');

const Score = {
  insert(obj, insertCallback) {
    db.query('INSERT INTO score(`game_id`, `user_id`, `score`) VALUES (?, ?, ?)', [obj.game_id, obj.user_id, obj.score], insertCallback);
  },
  findAllByUserId(userId, searchCallback) {
    db.query('SELECT * FROM score WHERE user_id = ?', [userId], searchCallback);
  },
};

module.exports = Score;
