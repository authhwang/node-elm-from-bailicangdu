const router = require('express').Router();
const adminHandler = require('../controller/admin/admin.js');

router.post('/login',adminHandler.login);
router.get('/all',adminHandler.getAllAdmin);
router.get('/info',adminHandler.getAdminInfo);
router.get('/count',adminHandler.getAdminCount);
router.get('/signout',adminHandler.signout);
module.exports = router;