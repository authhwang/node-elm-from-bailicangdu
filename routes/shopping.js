const router = require('express').Router();
const shopHandler = require('../controller/shopping/shop.js');
const categoryHandler = require('../controller/shopping/category.js');


router.get('/restaurants',shopHandler.getRestaurants);
router.get('/v2/restaurants/category',categoryHandler.getCategories);
router.get('/v1/restaurants/delivery_modes',categoryHandler.getDelivery);
router.get('/v1/restaurants/activity_attributes',categoryHandler.getActivity);
module.exports = router;