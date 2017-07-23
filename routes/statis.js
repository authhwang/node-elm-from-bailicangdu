const router = require('express').Router();
const statisHandler = require('../controller/statis/statis.js');

router.get('/api/:date/count',statisHandler.apiCount);

module.exports = router;