const express = require('express');
const router = express.Router();
const cityHandle = require('../controller/v1/cities.js');

router.get('/cities',cityHandle.getCity);
module.exports = router;