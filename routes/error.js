const router = require('express').Router();

router.all('/', (req, res) => {
  res.status(404).send({ message: 'Такого ресурса нет' });
});

module.exports = router;
