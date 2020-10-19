const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const uRouters = require('./routes/users.js');
const cRouters = require('./routes/cards.js');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '5f6cf36dccf86a50301904c1',
  };

  next();
});
app.use('/', uRouters);
app.use('/', cRouters);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер ${PORT}`);
});
