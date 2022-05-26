const router = require('express').Router();
const user = require('../controllers/user.controller');

router.post('/register', user.register);

router.post('/login', user.login);

router.get('/profile', user.profile);

router.put('/update', user.update);

router.post('/bookmarks/:id', user.addBookmark);

router.delete('/bookmarks/:id', user.deleteBookmark);

router.delete('/delete/:id', user.delete);

module.exports = router;