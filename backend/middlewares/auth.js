require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const DataError = require('../errors/data-err');

module.exports = (req, res, next) => {
  const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new DataError('Неправильные почта или пароль');
  }
  req.user = payload;
  next();
};
