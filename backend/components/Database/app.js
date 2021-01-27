const mysql = require('mysql2');
const Constants = require('../../constant/constant');

module.exports = class Database {
  constructor() {
    this.pool = this.createPool();
  }

  createPool() {
    return mysql.createPool({
      connectionLimit: 5,
      host: Constants.database.host,
      user: Constants.database.login,
      database: Constants.database.database,
      password: Constants.database.password,
    });
  }

  executeInConnection(cb) {
    return this.pool.getConnection((err, connection) => {
      if (err) throw new Error(err.message);

      if (cb) {
        cb(connection);
        connection.release();
      }
    });
  }

  query(query, cb = null) {
    const callback = (connection) => {
      connection.query(query, (err, result) => {
        if (cb) cb(result);
      });
    };

    this.executeInConnection(callback);
  }
};
