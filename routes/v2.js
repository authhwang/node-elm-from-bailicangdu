const router = require('express').Router();
const cityHandle = require('../controller/v1/cities.js');
const entryHandle = require('../controller/v2/entry.js');

router.get('/pois/:geohash',cityHandle.pois);
router.get('/index_entry',entryHandle.getEntry);
module.exports = router;