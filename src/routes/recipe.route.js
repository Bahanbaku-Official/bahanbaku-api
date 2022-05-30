const router = require('express').Router();
const recipe = require('../controllers/recipe.controller');
const jwtMiddleware = require('../middlewares/jwtAuth');

router.get('/', recipe.findAll);

router.get('/:id', jwtMiddleware, recipe.findById);

router.post('/create', jwtMiddleware, recipe.create);

router.put('/update/:id',jwtMiddleware, recipe.update);

router.delete('/delete/:id',jwtMiddleware, recipe.delete);

module.exports = router;