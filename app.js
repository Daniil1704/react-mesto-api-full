require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const uRouters = require('./routes/users.js');
const cRouters = require('./routes/cards.js');
const { celebrate, Joi, errors } = require('celebrate');
const requestLimit = require('express-rate-limit');
const error = require('./routes/error.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const { login, buildUser } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');
const { validatorLink } = require('./middlewares/validate.js');
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const limit = requestLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(cors());
app.use(limit);
app.use(requestLogger);


app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(10).pattern(/^\S+$/),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(10).pattern(/^\S+$/),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validatorLink),
  }).unknown(true),
}), buildUser);
app.use(auth);

app.use('/', uRouters);
app.use('/', cRouters);
app.use('*', error);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  console.log(err.name);
  res.status(500).send({ message: `К сожалению на сервере произошла ошибка: ${err.message}` });
  next();
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер ${PORT}`);
});
