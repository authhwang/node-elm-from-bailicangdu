const router = require('express').Router();
const shopHandler = require('../controller/shopping/shop.js');
const categoryHandler = require('../controller/shopping/category.js');


router.get('/restaurants',shopHandler.getRestaurants);
router.get('/restaurant/:restaurant_id',shopHandler.getRestaurantDatail);
router.get('/v1/restaurants/delivery_modes',categoryHandler.getDelivery);
router.get('/v1/restaurants/activity_attributes',categoryHandler.getActivity);
router.get('/v2/restaurants/category',categoryHandler.getCategories);

module.exports = router;