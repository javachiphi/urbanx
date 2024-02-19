const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Spot = require('./models/spot');

mongoose.connect('mongodb://localhost:27017/urbanx', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/spots', async (req, res) => {
  const spots = await Spot.find({});

  res.render('spots/index', { spots });
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
