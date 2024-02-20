const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { spotSchema } = require('../schemas');
const Spot = require('../models/spot');
const { isLoggedIn } = require('../middleware');

const validateSpot = (req, res, next) => {
  const { error } = spotSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.use((req, res, next) => {
  next();
});

router.get('/', async (req, res) => {
  const spots = await Spot.find({});

  res.render('spots/index', { spots });
});

router.get('/new', isLoggedIn, async (req, res) => {
  res.render('spots/new');
});

router.post(
  '/',
  isLoggedIn,
  validateSpot,
  catchAsync(async (req, res) => {
    const { title, location } = req.body;
    const spot = new Spot({ title, location });
    await spot.save();

    req.flash('success', 'Spot created successfully!');
    res.redirect(`/spots/${spot._id}`);
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id).populate('reviews');

    if (!spot) {
      req.flash('error', 'Cannot find that spot!');
      return res.redirect('/spots');
    }
    res.render('spots/show', { spot });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);

    if (!spot) {
      req.flash('error', 'Cannot find that spot!');
      return res.redirect('/spots');
    }

    res.render('spots/edit', { spot });
  })
);

router.put(
  '/:id/edit',
  isLoggedIn,
  validateSpot,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, image, description } = req.body;

    const spot = await Spot.findByIdAndUpdate(
      id,
      { title, location, image, description },
      { runValidators: true, new: true }
    );
    req.flash('success', 'Spot updated successfully!');

    res.redirect(`/spots/${spot._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    res.redirect('/spots');
  })
);

module.exports = router;
