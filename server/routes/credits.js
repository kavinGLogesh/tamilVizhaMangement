const router = require('express').Router();
const auth = require('../middleware/auth');
const { getCredits, addCredit, updateCredit, deleteCredit } = require('../controllers/creditController');
router.get('/', auth, getCredits);
router.post('/', auth, addCredit);
router.put('/:id', auth, updateCredit);
router.delete('/:id', auth, deleteCredit);
module.exports = router;
