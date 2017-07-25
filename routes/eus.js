const router = require('express').Router();
const userHandler = require('../controller/v2/user.js');

router.post('/v1/users/:user_id/avatar',userHandler.updateAvatar);
module.exports = router;