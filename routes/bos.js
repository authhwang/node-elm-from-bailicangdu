const express = require('express')
const router = express.Router();
const orderHander = require('../controller/v1/order.js');

router.get('/orders/count',orderHander.getOrdersCount);
router.get('/v2/users/:user_id/orders',orderHander.getOrders);
router.get('/v1/users/:user_id/orders/:order_id/snapshot',orderHander.getDetail);

module.exports = router;