const mysql = require('mysql2');
const Constants = require('../../constant/constant');

class Database {
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
      }

      connection.release();
    });
  }

  query(query, params = null, cb = null) {
    const callback = (connection) => {
      connection.query(query, params, (err, result) => {
        if (err) return cb(err, null);
        if (cb) return cb(null, result);
      });
    };

    this.executeInConnection(callback);
  }
}

const db = {};
db.database = new Database();
db.query = db.database.query.bind(db.database);

module.exports = db;
