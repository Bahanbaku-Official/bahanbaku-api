const router = require('express').Router();
const user = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwtAuth');
const isAdmin = require('../middlewares/isAdmin');
const multer = require('../config/multer');
const { 
  registerRules,
  loginRules, 
  locationRules, 
  validate } 
= require('../helpers/validator');

router.post('/register',registerRules(), validate, user.register);

router.post('/login',loginRules(), validate, user.login);

router.get('/profile',jwtMiddleware, user.profile);

router.put('/update',jwtMiddleware, user.update);

router.put('/update-location',locationRules(), validate, jwtMiddleware, user.updateLocation);

router.post('/upload-picture',jwtMiddleware, multer.single('image'), user.uploadPicture);

router.post('/bookmarks/:id',jwtMiddleware, user.addBookmark);

router.delete('/bookmarks/:id',jwtMiddleware, user.deleteBookmark);

router.delete('/delete/:id',jwtMiddleware, isAdmin, user.delete);

router.get('/nearby-resto',jwtMiddleware, user.getNearbyRestaurant);

module.exports = router;