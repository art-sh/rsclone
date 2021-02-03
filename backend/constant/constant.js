const config = {
  port: process.env.PORT || 5000,
  database: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    login: process.env.DB_LOGIN,
    password: process.env.DB_PASSWORD,
  },
  appTokenSecret: process.env.APP_TOKEN_SECRET,
};

module.exports = config;
