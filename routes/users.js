const router = require('express').Router();
const {
  getUsers, getUserById, buildUser, changeUser, changeAvatar,
} = require('../controllers/users.js');

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.post('/users', buildUser);

router.patch('/users/me', changeUser);

router.patch('/users/me/avatar', changeAvatar);

module.exports = router;
