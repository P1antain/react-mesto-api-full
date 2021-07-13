const jwt = require('jsonwebtoken');
const NotFoundUserError = require('../errors/NotFoundError');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new NotFoundUserError('Неверный токен'));
  }
  req.user = payload;

  next();
};
