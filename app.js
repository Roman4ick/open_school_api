const { celebrate, Joi, errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const { PORT = 3000 } = process.env;

const routerarticle = require('./routes/article');

const { login, createUser } = require('./controllers/users.js');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const NotFoundError = require('./errors/not-found-err');
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/open_school', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().regex(/[a-zA-Z0-9]{3,30}/).min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
app.use(auth);
app.use(routerarticle);
app.use('/', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден!');
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Произошла ошибка' : message });
  next();
});

app.listen(PORT);
