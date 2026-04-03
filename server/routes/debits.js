
const router = require('express').Router();
const auth = require('../middleware/auth');
const { getDebits, addDebit, updateDebit, deleteDebit } = require('../controllers/debitController');
router.get('/', auth, getDebits);
router.post('/', auth, addDebit);
router.put('/:id', auth, updateDebit);
router.delete('/:id', auth, deleteDebit);
module.exports = router;
