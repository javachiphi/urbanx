const mongoose = require('mongoose');
const Spot = require('../models/spot');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/urbanx');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const seedDB = async () => {
  await Spot.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const spots = new Spot({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
    });

    await spots.save();
  }
};

seedDB();
