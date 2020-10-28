const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validatorLink } = require('../middlewares/validate.js');

const {
  getCards,
  deleteCard,
  buildCard,
  like,
  deleteLike,
} = require('../controllers/cards.js');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validatorLink),
  }),
}), buildCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), like);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteLike);

module.exports = router;
