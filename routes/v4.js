const router = require('express').Router();
const shopHandler = require('../controller/shopping/shop.js');

router.get('/restaurants',shopHandler.searchRestaurant);
module.exports = router;