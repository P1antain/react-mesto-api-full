const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const routerCards = require('./routes/cards');
const routerUser = require('./routes/users');

const { login, createUser } = require('./controllers/users');

const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { validateSignin, validateSignup } = require('./middlewares/celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const page404 = require('./routes/page404');

const { PORT = 80 } = process.env;
const app = express();

const allowedCors = [
  'https://http://p1antain.students.nomoredomains.work',
  'https://http://api.p1antain.students.nomoredomains.club',
  'localhost:3000',
];

app.use(cors({
  origin: allowedCors,
}));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  next();
});

app.use(cookieParser());
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);
app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);
app.use('/', routerUser);
app.use('/', routerCards);
app.use('/', page404);
app.use(errorLogger);

app.use(helmet());

app.use(auth);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
