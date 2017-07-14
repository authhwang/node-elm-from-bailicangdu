const router = require('express').Router();
const ratingHandler = require('../controller/ugc/rating');

router.get('/v2/restaurants/:restaurant_id/ratings',ratingHandler.getRatings);
module.exports = router;