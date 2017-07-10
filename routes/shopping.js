const router = require('express').Router();
const shop = require('../controller/shopping/shop.js');

router.get('/restaurants',shop.getRestaurants);

module.exports = router;