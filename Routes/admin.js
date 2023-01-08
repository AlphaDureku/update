const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController')

router.get('/', adminController.test)
router.post('/login', adminController.login)
router.get('/dashboard', adminController.dashboard)


module.exports = router;