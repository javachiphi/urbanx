const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Spot = require('../models/spot');
const { isLoggedIn, isAuthor, validateSpot } = require('../middleware');
const spots = require('../controllers/spots');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.use((req, res, next) => {
  next();
});

router
  .route('/')
  .get(catchAsync(spots.index))
  // .post(isLoggedIn, validateSpot, catchAsync(spots.createSpot));
  .post(upload.single('image'), (req, res) => {
    console.log(req.body, req.file);
    res.send('it worked');
  });

router.get('/new', isLoggedIn, spots.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(spots.showSpot))
  .put(isLoggedIn, isAuthor, validateSpot, catchAsync(spots.updateSpot))
  .delete(isLoggedIn, isAuthor, catchAsync(spots.deleteSpot));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(spots.renderEditForm));

module.exports = router;
