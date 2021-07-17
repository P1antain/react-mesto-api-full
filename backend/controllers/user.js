const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OK } = require('../constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const { JWT_SECRET = 'some-secret-key' } = process.env;

module.exports = {
  login(req, res, next) {
    const { email, password } = req.body;
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.send({ token });
      })
      .catch(next);
  },
  getUserInfo(req, res, next) {
    User.findById(req.user._id)
      .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
      .then((user) => {
        res.send({
          name: user.name,
          about: user.about,
          email: user.email,
          avatar: user.avatar,
          id: user._id,
        });
      })
      .catch(next);
  },
  findUsers(req, res, next) {
    User.find({})
      .then((users) => res.send({ data: users }))
      .catch(next);
  },
  findOneUser(req, res, next) {
    User.findById(req.params.userId)
      .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
      .then((user) => {
        res.status(OK).send({ user });
      })
      .catch(next);
  },
  createUser(req, res, next) {
    const {
      name, about, avatar, email, password,
    } = req.body;
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then(() => res.status(OK).send({
        data: {
          name, about, avatar, email,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные при создании пользователя');
        } else if (err.name === 'MongoError') {
          throw new ConflictError('Ошибка базы данных');
        } else {
          next(err);
        }
      })
      .catch(next);
  },
  updateProfile(req, res, next) {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => {
        res.status(OK).send(user);
      })
      .catch(next);
  },
  updateAvatar(req, res, next) {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => {
        res.status(OK).send({ user });
      })
      .catch(next);
  },
};
