const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflickErr = require('../errors/ConflictErr');
const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
  .then((users) => res.status(200).send(users))
  .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr({ message: 'Такого пользователя нет' });
      }
      res.send(user);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null || undefined) {
        throw new NotFoundErr({ message: 'Такого пользователя не существует' });
      }
     res.status(200).send({ data: user });
    })
    .catch(next);
};
const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '24h' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

const buildUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => User.create({
    name: name || "Введите имя",
    about: about || "О себе",
    avatar: avatar || "https://sun9-46.userapi.com/c845121/v845121923/66f80/mJLY0hK_0X0.jpg",
    email,
    password: hash,
  }))
  .catch((err) => {
    if (err.name === 'MongoError' || err.code === 11000) {
      throw new ConflickErr({ message: 'Пользователь с таким email уже есть, введите другой email' });
    } else next(err);
  })
  .then((user) => res.status(201).send({ message: `Пользователь с ${user.email} зарегистрирован` }))
  .catch(next);
};

const changeUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw new BadRequestErr({ message: 'Переданы не корректные данные' });
    } else next(err);
  })
  .catch(next);
};

const changeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw new BadRequestErr({ message: 'Переданы не корректные данные' });
    } else next(err);
  })
  .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  login,
  buildUser,
  changeUser,
  changeAvatar,
  getUser
};
