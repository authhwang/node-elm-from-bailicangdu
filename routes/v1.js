const express = require('express');
const router = express.Router();
const cityHandler = require('../controller/v1/cities.js');
const searchHandler = require('../controller/v1/search.js');
const cartsHanlder = require('../controller/v1/carts.js');
const remarkHandler = require('../controller/v1/remark.js');
const addressHandler = require('../controller/v1/address.js');
const captchasHandler = require('../controller/v1/captchas.js');
const baseClass =  require('../prototype/baseComponent.js');
const baseHandler = new baseClass();


router.post('/captchas',captchasHandler.getCaptchas);
router.post('/addimg/:type',baseHandler.uploadImg);
router.post('/carts/checkout',cartsHanlder.checkout);
router.get('/users/:user_id/address',addressHandler.getAddress);
router.get('/cities',cityHandler.getCity);
router.get('/cities/:id',cityHandler.getCityById);
router.get('/pois',searchHandler.search);
router.get('/carts/:cart_id/remarks',remarkHandler.getRemarks);
module.exports = router;