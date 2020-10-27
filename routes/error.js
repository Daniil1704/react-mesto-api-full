const router = require('express').Router();

router.all('/', () => {
throw new NotFoundErr({ message: 'Такого ресурса нет' });
});

module.exports = router;
