const express = require('express');
const router = express.Router();

router.use('/', require('./routes/index'));
router.use('/users', require('./routes/users'));
router.use('/pcs', require('./routes/pcs'));
router.use('/npcs', require('./routes/npcs'));
router.use('/locations', require('./routes/locations'));
router.use('/relationships', require('./routes/relationships'));

module.exports = router;