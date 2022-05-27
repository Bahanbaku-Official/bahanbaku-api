const router = require('express').Router();
const supplier = require('../controllers/supplier.controller');

router.get('/', supplier.findAll);

router.get('/:id', supplier.findById);

router.post('/create', supplier.create);

router.put('/update/:id', supplier.update);

router.delete('/delete/:id', supplier.delete);

module.exports = router;