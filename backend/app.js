require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const routerCards = require('./routes/cards');
const routerUser = require('./routes/users');

const { login, createUser } = require('./controllers/users');

const { validateSignin, validateSignup } = require('./middlewares/celebrate');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const page404 = require('./routes/page404');

const { PORT = 3000 } = process.env;
const app = express();

const options = {
  origin: [
    'https://api.p1antain.students.nomoredomains.club',
    'https://p1antain.students.nomoredomains.work',
    'http://localhost:3000/',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);
app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(helmet());

app.use(auth);

app.use('/', routerUser);

app.use('/', routerCards);

app.use('/', page404);
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
