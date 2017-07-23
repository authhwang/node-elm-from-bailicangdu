const express = require('express');
const router = express.Router();
const cityHandler = require('../controller/v1/cities.js');
const searchHandler = require('../controller/v1/search.js');
const cartsHanlder = require('../controller/v1/carts.js');
const remarkHandler = require('../controller/v1/remark.js');
const addressHandler = require('../controller/v1/address.js');
const userHandler = require('../controller/v2/user.js');
const captchasHandler = require('../controller/v1/captchas.js');
const ordersHandler = require('../controller/v1/order.js');
const hongbaoHander = require('../controller/promotion/hongbao.js');
const baseClass =  require('../prototype/baseComponent.js');
const baseHandler = new baseClass();


router.post('/captchas',captchasHandler.getCaptchas);
router.post('/addimg/:type',baseHandler.uploadImg);
router.post('/carts/checkout',cartsHanlder.checkout);
router.post('/users/:user_id/addresses',addressHandler.addAddress);
router.post('/users/:user_id/carts/:cart_id/orders',ordersHandler.postOrder);
router.post('/users/:user_id/hongbao/exchange',hongbaoHander.exchange);
router.get('/users/:user_id/hongbao/exchange',)
router.get('/pois',searchHandler.search);
router.get('/user',userHandler.getInfo);
router.get('/cities',cityHandler.getCity);
router.get('/cities/:id',cityHandler.getCityById);
router.get('/user/count',userHandler.getUserCount);
router.get('/carts/:cart_id/remarks',remarkHandler.getRemarks);
router.get('/users/:user_id/addresses',addressHandler.getAddress);
router.delete('/users/:user_id/addresses/:address_id',addressHandler.delAddress);
module.exports = router;