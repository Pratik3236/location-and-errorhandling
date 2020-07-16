const express = require('express');
const router = express.Router();
const locationController = require('../../controllers/location/locationController');

router.post('/countrycodes/:page', locationController.getCountries);

router.post('/statedetails/:page', locationController.getStates);

router.post('/citydetails/:page', locationController.getCities);

module.exports = router;