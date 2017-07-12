const express = require('express');
const router = express.Router();
const cityHandle = require('../controller/v1/cities.js');
const searchHandle = require('../controller/v1/search.js');
const baseClass =  require('../prototype/baseComponent.js');
const baseHandle = new baseClass();

router.get('/cities',cityHandle.getCity);
router.get('/cities/:id',cityHandle.getCityById);
router.get('/pois',searchHandle.search);
router.post('/addimg/:type',baseHandle.uploadImg);
module.exports = router;