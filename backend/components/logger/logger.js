const path = require('path');
const pino = require('pino');
const expressPino = require('express-pino-logger');

const logger = pino(
  path.resolve(__dirname, '..', 'logs', 'info.log'),
  {
    level: 'info',
    name: 'Main log',
    safe: true,
  },
);
const expressLogger = expressPino({
  logger,
  serializers: {
    req: (req) => ({
      body: req.raw.body,
      headers: req.headers,
      method: req.method,
      url: req.url,
      user: req.raw.user,
    }),
  },
});

module.exports = expressLogger;
