const router = require('express').Router();
const ingredient = require('../controllers/ingredient.controller');
const jwtMiddleware = require('../middlewares/jwtAuth');

router.get('/', jwtMiddleware, ingredient.getIngredient);

module.exports = router;