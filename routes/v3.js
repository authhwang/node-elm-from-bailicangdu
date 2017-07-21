const router = require('express').Router();
const explainHandler = require('../controller/v3/explain.js');

router.get('/profile/explain',explainHandler.getExplain);

module.exports = router;