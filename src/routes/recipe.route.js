const router = require('express').Router();
const recipe = require('../controllers/recipe.controller');
const isAdmin = require('../middlewares/isAdmin');
const jwtMiddleware = require('../middlewares/jwtAuth');

router.get('/', recipe.findAll);

router.get('/:id', jwtMiddleware, recipe.findById);

router.post('/create', jwtMiddleware, isAdmin, recipe.create);

router.put('/update/:id',jwtMiddleware, isAdmin, recipe.update);

router.delete('/delete/:id',jwtMiddleware, isAdmin, recipe.delete);

module.exports = router;