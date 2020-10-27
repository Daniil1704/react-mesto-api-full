const Card = require('../models/card');
const BadRequestErr = require('../errors/BadRequestErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
const buildCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr({ message: 'Переданы не корректные данные' });
      } else next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundErr({ message: 'Карточка не найдена' }))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenErr({ message: 'Удалять можно только свои карточки' });
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch(next);
};

const like = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )

    .orFail(() => new NotFoundErr({ message: 'Карточка не существует' }))

    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundErr({ message: 'Карточка не существует' }))
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch(next);
};

module.exports = {
  getCards,
  buildCard,
  deleteCard,
  like,
  deleteLike,
};
