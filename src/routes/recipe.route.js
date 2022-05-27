const router = require('express').Router();
const recipe = require('../controllers/recipe.controller');

router.get('/', recipe.findAll);

router.get('/:id', recipe.findById);

router.post('/create', recipe.create);

router.put('/update/:id', recipe.update);

router.delete('/delete/:id', recipe.delete);

module.exports = router;