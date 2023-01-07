const express = require('express');
const router = express.Router();
const searchController = require('../controller/searchController');
const trackAppointmentController = require('../controller/trackAppointmentController')


router.get('/:id', searchController.getProfile)


module.exports = router;