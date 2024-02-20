const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Spot = require('./models/spot');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser');
const { reviewSchema } = require('./schemas');
const Review = require('./models/review');
const spots = require('./routes/spots');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/urbanx');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

app.use('/spots', spots);

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/spots/:id/reviews', validateReview, async (req, res) => {
  console.log('hey');
  const { id } = req.params;
  const spot = await Spot.findById(id);

  const { body, rating } = req.body;
  const review = new Review({ body, rating });
  await review.save();
  spot.reviews.push(review);
  await spot.save();

  res.redirect(`/spots/${spot._id}`);
});

app.delete('/spots/:id/reviews/:reviewId', async (req, res) => {
  const { id, reviewId } = req.params;
  await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  // res.send('delete me');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
  // res.send('404!!');
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
