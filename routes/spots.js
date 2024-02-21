const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Spot = require('../models/spot');
const { isLoggedIn, isAuthor, validateSpot } = require('../middleware');
const spots = require('../controllers/spots');

router.use((req, res, next) => {
  next();
});

router.get('/', catchAsync(spots.index));

router.get('/new', isLoggedIn, spots.renderNewForm);

router.post('/', isLoggedIn, validateSpot, catchAsync(spots.createSpot));

router.get('/:id', catchAsync(spots.showSpot));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(spots.renderEditForm));

router.put(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  validateSpot,
  catchAsync(spots.updateSpot)
);

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(spots.deleteSpot));

module.exports = router;
