const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const constants = require('./constant/constant');

const app = express();

const routesNotFound = require('./components/routes/not-found.routes');
const routesAuth = require('./components/routes/auth.routes');

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', routesAuth);
app.use('*', routesNotFound);

app.listen(constants.port, (error) => {
  if (error) throw new Error(error.message);

  console.log(`Backend listening at http://localhost:${constants.port}`);
});
