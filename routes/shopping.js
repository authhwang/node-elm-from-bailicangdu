const router = require('express').Router();
const shopHandler = require('../controller/shopping/shop.js');
const categoryHandler = require('../controller/shopping/category.js');


router.get('/restaurants',shopHandler.getRestaurants);
router.get('/v2/restaurants/category',categoryHandler.getCategories);
module.exports = router;