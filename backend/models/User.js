const db = require('../components/database/app');

const User = {
  validate(obj) {
    const out = {};
    Object.setPrototypeOf(out, {
      hasErrors: function checkErrors() {
        return !!Object.keys(this).length;
      },
    });

    if (obj.login.length < 5 || obj.login.length > 20) out.login = 'Login must be between 5 and 20 chars';
    if (obj.password.length < 8 || obj.password.length > 64) out.password = 'Password must be between 8 and 64 chars';

    return out;
  },
  write(obj, writeCallback) {
    const queryCallback = (err, result) => {
      if (result) delete result.password;

      writeCallback({
        error: (err) ? err.sqlMessage : null,
        result,
      });
    };

    db.query('INSERT INTO users(`login`, `name`, `password`, `date_create`) VALUES (?, ?, ?, ?)', [obj.login, obj.name, obj.password, obj.date_create], queryCallback);
  },
  findByLogin(login, searchCallback) {
    const queryCallback = (err, result) => {
      if (result) delete result.password;

      searchCallback({
        error: (err) ? err.sqlMessage : null,
        result,
      });
    };

    db.query('SELECT * FROM users WHERE login = ?', [login], queryCallback);
  },
  updateField(login, field, value, searchCallback) {
    const queryCallback = (err, result) => {
      if (result) delete result.password;

      searchCallback({
        error: (err) ? err.sqlMessage : null,
        result,
      });
    };

    db.query(`UPDATE users SET ${field} = ? WHERE login = ?`, [value, login], queryCallback);
  },
};

module.exports = User;
