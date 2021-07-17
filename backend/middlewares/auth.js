const jwt = require('jsonwebtoken');

const NoAuthorizationError = require('../errors/no-authorization');

const { JWT_SECRET = 'some-secret-key' } = process.env;

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NoAuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  // верифицируем токен
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new NoAuthorizationError('Необходима авторизация');
  }
  req.user = payload;// записываем пейлоуд в объект запроса

  console.log('payload req.user', req.user);
  console.log('req.params', req.params);

  next();
};
