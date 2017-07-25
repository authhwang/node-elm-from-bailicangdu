const router = require('express').Router();
const shopHandler = require('../controller/shopping/shop.js');
const categoryHandler = require('../controller/shopping/category.js');
const checkHandler = require('../middlewares/check.js');
const foodHandler = require('../controller/shopping/food.js');

router.post('/addshop',checkHandler.checkAdmin,shopHandler.addShop);
router.post('/addfood',checkHandler.checkAdmin,foodHandler.addFood);
router.post('/updateshop',checkHandler.checkAdmin,shopHandler.updateshop);
router.post('/addcategory',checkHandler.checkAdmin,foodHandler.addCategory);
router.post('/v2/updatefood',checkHandler.checkAdmin,foodHandler.updateFood);
router.get('/v2/menu',foodHandler.getMenu);
router.get('/v2/foods',foodHandler.getFoods);
router.get('/restaurants',shopHandler.getRestaurants);
router.get('/v2/foods/count',foodHandler.getFoodsCount);
router.get('/v2/menu/:category_id',foodHandler.getMenuDetail);
router.get('/restaurants/count',shopHandler.getShopCount);
router.get('/restaurant/:restaurant_id',shopHandler.getRestaurantDatail);
router.get('/getcategory/:restaurant_id',foodHandler.getCategory);
router.get('/v2/restaurants/category',categoryHandler.getCategories);
router.get('/v1/restaurants/delivery_modes',categoryHandler.getDelivery);
router.get('/v1/restaurants/activity_attributes',categoryHandler.getActivity);
router.delete('/v2/food/:food_id',checkHandler.checkSuperAdmin,foodHandler.deleteFood);
router.delete('/restaurant/:restaurant_id',checkHandler.checkSuperAdmin,shopHandler.deleteRestaurant);

module.exports = router;