const express = require('express');
const router = express.Router({ mergeParams: true });
const Spot = require('../models/spot');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const { validateReview } = require('../middleware');

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
    req.flash('success', 'Review created successfully!');
    res.redirect(`/spots/${spot._id}`);
  })
);

router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/spots/${id}`);

    // res.send('delete me');
  })
);

module.exports = router;
