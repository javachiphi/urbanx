const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Spot = require('./models/spot');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use = use every single request

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
  catchAsync(async (req, res) => {
    if (!req.body.title || !req.body.location)
      throw new ExpressError('Invalid Spot Data', 400);
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, location } = req.body;

    const spot = await Spot.findByIdAndUpdate(
      id,
      { title, location },
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

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
  // res.send('404!!');
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
