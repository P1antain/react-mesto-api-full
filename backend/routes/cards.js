const router = require('express').Router();
const { validateCardInfo, validateCardId } = require('../middlewares/celebrate');

const {
  createCard, getCards, deleteCardId, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/cards', validateCardInfo, createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', validateCardId, deleteCardId);
router.put('/cards/:cardId/likes', validateCardId, likeCard);
router.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
