const express = require('express');
const Constants = require('./constant/constant');
const Database = require('./components/Database/app');

const app = express();
const database = new Database(app);

app.get('/', (req, res) => {
  console.log(req, res);
  res.send('Hello Worlds!');
});

app.listen(Constants.port, (error) => {
  if (error) throw new Error(error.message);

  console.log(`Backend listening at http://localhost:${Constants.port}`);
});
