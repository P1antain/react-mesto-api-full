const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { validateUserId, validateUserInfo } = require('../middlewares/celebrate');

const {
  createUser, getUser, getUserId, patchUser, patchAvatar, getCurrentUser,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUser);
router.get('/users/me', auth, getCurrentUser);
router.get('/users/:userId', validateUserId, getUserId);
router.patch('/users/me', validateUserInfo, patchUser);
router.patch('/users/me/avatar', validateUserInfo, patchAvatar);

module.exports = router;
