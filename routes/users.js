const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validatorLink } = require('../middlewares/validate.js');

const {
  getUsers,
  getUserById,
  changeUser,
  changeAvatar,
  getUser,
} = require('../controllers/users.js');

router.get('/users', getUsers);

router.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }),
}), getUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validatorLink),
  }),
}), changeAvatar);

module.exports = router;
