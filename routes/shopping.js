const router = require('express').Router();
const shopHandler = require('../controller/shopping/shop.js');
const categoryHandler = require('../controller/shopping/category.js');
const checkHandler = require('../middlewares/check.js');
const foodHandler = require('../controller/shopping/food.js');

router.post('/addshop',shopHandler.addShop);
router.post('/addcategory',foodHandler.addCategory);
router.post('/addfood',foodHandler.addFood);
router.get('/v2/menu',foodHandler.getMenu);
router.get('/restaurants',shopHandler.getRestaurants);
router.get('/restaurants/count',shopHandler.getShopCount);
router.get('/restaurant/:restaurant_id',shopHandler.getRestaurantDatail);
router.get('/getcategory/:restaurant_id',foodHandler.getCategory);
router.get('/v2/restaurants/category',categoryHandler.getCategories);
router.get('/v1/restaurants/delivery_modes',categoryHandler.getDelivery);
router.get('/v1/restaurants/activity_attributes',categoryHandler.getActivity);

module.exports = router;