const router = require('express').Router();
const ratingHandler = require('../controller/ugc/rating');

router.get('/v2/restaurants/:restaurant_id/ratings',ratingHandler.getRatings);
router.get('/v2/restaurants/:restaurant_id/scores',ratingHandler.getScores);
router.get('/v2/restaurants/:restaurant_id/tags',ratingHandler.getTags);

module.exports = router;