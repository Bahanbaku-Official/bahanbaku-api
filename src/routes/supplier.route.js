const router = require('express').Router();
const supplier = require('../controllers/supplier.controller');
const jwtMiddleware = require('../middlewares/jwtAuth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/',jwtMiddleware, supplier.findAll);

router.get('/:id',jwtMiddleware, supplier.findById);

router.post('/create', jwtMiddleware, isAdmin, supplier.create);

router.put('/update/:id', jwtMiddleware, isAdmin, supplier.update);

router.delete('/delete/:id', jwtMiddleware, isAdmin, supplier.delete);

module.exports = router;