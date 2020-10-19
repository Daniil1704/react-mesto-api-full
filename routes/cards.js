const router = require('express').Router();
const {
  getCards, deleteCard, buildCard, like,
  deleteLike,
} = require('../controllers/cards.js');

router.get('/cards', getCards);

router.post('/cards', buildCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', like);

router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
