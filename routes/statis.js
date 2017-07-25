const router = require('express').Router();
const statisHandler = require('../controller/statis/statis.js');

router.get('/api/count',statisHandler.apiAllCount);
router.get('/api/:date/count',statisHandler.apiCount);
router.get('/user/:date/count',statisHandler.userCount);
router.get('/order/:date/count',statisHandler.orderCount);
router.get('/admin/:date/count',statisHandler.adminCount);

module.exports = router;