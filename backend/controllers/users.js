const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundUserError = require('../errors/NotFoundUserError');

module.exports.createUser = (req, res, next) => {
  const {
    name, avatar, about, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((encryptedPassword) => {
      User.create({
        name, avatar, about, email, password: encryptedPassword,
      })
        .then(() => res.status(200).send({
          data: {
            name, about, avatar, email,
          },
        }))
        .catch((err) => {
          if (!email || !password) {
            return next(new BadRequestError('Вы не заполнили обязательные поля'));
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            return next(new ConflictError('Такой пользователь уже существует'));
          }
          return next(err);
        });
    });
};

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Нет такого пользователя'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный запрос'));
      }
      return next(err);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Нет такого пользователя'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не заполнили обязательные поля'));
      }
      return next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь отсутствует'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не заполнили обязательные поля'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundUserError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotFoundUserError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            'secret-key',
            { expiresIn: '7d' },
          );

          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })

            .status(201).send({
              message: 'Аутентификация прошла успешно',
            });
        });
    })

    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Такого пользователя нет в базе'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверный запрос'));
      }
      return next(err);
    });
};
