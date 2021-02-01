const db = require('../components/database/app');

const User = {
  write(obj, writeCallback) {
    db.query('INSERT INTO users(`login`, `name`, `password`, `date_create`) VALUES (?, ?, ?, ?)', [obj.login, obj.name, obj.password, obj.date_create], writeCallback);
  },
  findByLogin(login, searchCallback) {
    db.query('SELECT * FROM users WHERE login = ?', [login], searchCallback);
  },
  updateField(login, field, value, searchCallback) {
    db.query(`UPDATE users SET ${field} = ? WHERE login = ?`, [value, login], searchCallback);
  },
};

module.exports = User;
