const router = require('express').Router();
const user = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwtAuth');
const isAdmin = require('../middlewares/isAdmin');
const multer = require('../config/multer');

router.post('/register', user.register);

router.post('/login', user.login);

router.get('/profile',jwtMiddleware, user.profile);

router.put('/update',jwtMiddleware, user.update);

router.put('/update-location',jwtMiddleware, user.updateLocation);

router.post('/upload-picture',jwtMiddleware, multer.single('image'), user.uploadPicture);

router.post('/bookmarks/:id',jwtMiddleware, user.addBookmark);

router.delete('/bookmarks/:id',jwtMiddleware, user.deleteBookmark);

router.delete('/delete/:id',jwtMiddleware, isAdmin, user.delete);

module.exports = router;