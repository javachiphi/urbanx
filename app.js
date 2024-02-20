const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Spot = require('./models/spot');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const bodyParser = require('body-parser');
const { spotSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');

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

const validateSpot = (req, res, next) => {
  const { error } = spotSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/spots', async (req, res) => {
  const spots = await Spot.find({});

  res.render('spots/index', { spots });
});

app.get('/spots/new', async (req, res) => {
  res.render('spots/new');
});

app.post(
  '/spots',
  validateSpot,
  catchAsync(async (req, res) => {
    const { title, location } = req.body;
    const spot = new Spot({ title, location });
    await spot.save();

    res.redirect(`/spots/${spot._id}`);
  })
);

app.get(
  '/spots/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);

    res.render('spots/show', { spot });
  })
);

app.get(
  '/spots/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);

    res.render('spots/edit', { spot });
  })
);

app.put(
  '/spots/:id',
  validateSpot,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location, image, description } = req.body;

    const spot = await Spot.findByIdAndUpdate(
      id,
      { title, location, image, description },
      { runValidators: true, new: true }
    );

    res.redirect(`/spots/${spot._id}`);
  })
);

app.delete(
  '/spots/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    res.redirect('/spots');
  })
);

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
