const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Spot = require('./models/spot');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/urbanx');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

app.post('/spots', async (req, res) => {
  const { title, location } = req.body;
  const spot = new Spot({ title, location });
  await spot.save();
  res.redirect(`/spots/${spot._id}`);
});

app.get('/spots/:id', async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id);

  res.render('spots/show', { spot });
});

app.get('/spots/:id/edit', async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id);

  res.render('spots/edit', { spot });
});

app.put('/spots/:id', async (req, res) => {
  const { id } = req.params;
  const { title, location } = req.body;

  const spot = await Spot.findByIdAndUpdate(
    id,
    { title, location },
    { runValidators: true, new: true }
  );

  res.redirect(`/spots/${spot._id}`);
});

app.get('/createSpot', async (req, res) => {
  const spot = new Spot({
    title: 'New York',
    description: 'City that never sleeps',
    image: 'https://source.unsplash.com/weekly?newyork',
    location: 'New York',
  });
  await spot.save();
  res.send(spot);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
