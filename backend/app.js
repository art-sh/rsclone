require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./components/logger/logger');
const constants = require('./constant/constant');

const app = express(); //

const routesNotFound = require('./components/routes/not-found.routes');
const routesAuth = require('./components/routes/auth.routes');
const routesUser = require('./components/routes/user.routes');
const routesScore = require('./components/routes/score.routes');

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(logger);
app.use('*', (req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'App-Token');
  next();
});

app.use('/auth', routesAuth);
app.use('/user', routesUser);
app.use('/score', routesScore);
app.use('*', routesNotFound);

app.listen(constants.port, (error) => {
  if (error) throw new Error(error.message);

  console.log(`Backend listening at http://localhost:${constants.port}`);
});
