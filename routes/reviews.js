const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError');
const Spot = require('../models/spot');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    console.log('msg', msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    console.log('hey');
    const { id } = req.params;
    const spot = await Spot.findById(id);
    console.log('spot', req.params);

    const { body, rating } = req.body;
    const review = new Review({ body, rating });
    await review.save();
    spot.reviews.push(review);
    await spot.save();

    res.redirect(`/spots/${spot._id}`);
  })
);

router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/spots/${id}`);

    // res.send('delete me');
  })
);

module.exports = router;
