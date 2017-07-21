const express = require('express')
const router = express.Router();
const orderHander = require('../controller/v1/order.js');

router.get('/v2/users/:user_id/orders',orderHander.getOrders);

module.exports = router;