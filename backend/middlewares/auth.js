const jwt = require('jsonwebtoken');
const NotFoundUserError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new NotFoundUserError('Неверный токен'));
  }
  req.user = payload;

  next();
};
