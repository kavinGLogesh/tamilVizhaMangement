
const router = require('express').Router();
const auth = require('../middleware/auth');
const { getRecords, addRecord, updateRecord, getAllRecords, deleteRecord, searchRecords } = require('../controllers/recordController');

router.get('/search', auth, searchRecords);
router.get('/all', auth, getAllRecords);
router.get('/', auth, getRecords);
router.post('/', auth, addRecord);
router.put('/:id', auth, updateRecord);
router.delete('/:id', auth, deleteRecord);

module.exports = router;
