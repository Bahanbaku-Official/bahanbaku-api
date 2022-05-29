const router = require('express').Router();
const user = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwtAuth');

router.post('/register', user.register);

router.post('/login', user.login);

router.get('/profile',jwtMiddleware, user.profile);

router.put('/update', user.update);

router.post('/bookmarks/:id', user.addBookmark);

router.delete('/bookmarks/:id', user.deleteBookmark);

router.delete('/delete/:id', user.delete);

module.exports = router;