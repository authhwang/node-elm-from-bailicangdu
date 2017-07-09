const router = require('express').Router();
const cityHandle = require('../controller/v1/cities.js');

router.get('/pois/:geohash',cityHandle.pois);

module.exports = router;