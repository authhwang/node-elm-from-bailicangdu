const router = require('express').Router();
const hongbaoHandler = require('../controller/promotion/hongbao.js');

router.get('/v2/users/:user_id/hongbaos',hongbaoHandler.getHongbao);
router.get('/v2/users/:user_id/expired_hongbaos',hongbaoHandler.getExpiredHongbao);
module.exports = router;
