const router = require('express').Router();
const cityHandler = require('../controller/v1/cities.js');
const entryHandler = require('../controller/v2/entry.js');
const userHandler = require('../controller/v2/user.js');


router.post('/login',userHandler.login);
router.post('/changepassword',userHandler.changePassword);
router.get('/signout',userHandler.signout);
router.get('/index_entry',entryHandler.getEntry);
router.get('/pois/:geohash',cityHandler.pois);
module.exports = router;