const router = require('express').Router();
const adminHandler = require('../controller/admin/admin.js');

router.post('/login',adminHandler.login);
router.get('/signout',adminHandler.signout);
router.get('/info',adminHandler.getAdminInfo);
module.exports = router;