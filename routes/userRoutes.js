const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.put('/:userId/location', userController.updateUserLocation);
router.get('/:userId/weather/:date', userController.getUserWeatherData);

module.exports = router;
