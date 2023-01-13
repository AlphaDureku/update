const express = require('express');
const router = express.Router();
const headAdmin = require('../controller/headAdminController');

router.get('/', headAdmin.index)
router.get('/insert', headAdmin.insertheadAdmin)
router.get('/dashboard', headAdmin.dashboard)
router.post('/authorize', headAdmin.authorization)
router.post('/match', headAdmin.match)
router.post('/addDoctor', headAdmin.insertDoctor)
router.post('/addSec', headAdmin.insertAdmin)
module.exports = router;