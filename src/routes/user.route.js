const router = require('express').Router();
const user = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwtAuth');

router.post('/register', user.register);

router.post('/login', user.login);

router.get('/profile',jwtMiddleware, user.profile);

router.put('/update',jwtMiddleware, user.update);

router.post('/bookmarks/:id',jwtMiddleware, user.addBookmark);

router.delete('/bookmarks/:id',jwtMiddleware, user.deleteBookmark);

router.delete('/delete/:id',jwtMiddleware, user.delete);

module.exports = router;