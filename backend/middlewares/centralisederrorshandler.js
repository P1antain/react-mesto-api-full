const { ERR_INTERNAL_SERVER_ERROR } = require('../constants');

module.exports = (err, req, res, next) => {
  const { statusCode = ERR_INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === ERR_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};
