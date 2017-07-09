const express = require('express');
const router = express.Router();
const cityHandle = require('../controller/v1/cities.js');
const searchHandle = require('../controller/v1/search.js');

router.get('/cities',cityHandle.getCity);
router.get('/cities/:id',cityHandle.getCityById);
router.get('/pois',searchHandle.search);
module.exports = router;