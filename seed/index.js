const mongoose = require('mongoose');
const Spot = require('../models/spot');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/urbanx');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Spot.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const spots = new Spot({
      author: '65d464dea5478bf6f02b53dd',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/drqzbwrjf/image/upload/v1708489044/UrbanX/w4lojppzemuie5m0mijz.png',
          filename: 'UrbanX/w4lojppzemuie5m0mijz',
        },
        {
          url: 'https://res.cloudinary.com/drqzbwrjf/image/upload/v1708489045/UrbanX/k6fd4pdlgsyruy3zz1lm.png',
          filename: 'UrbanX/k6fd4pdlgsyruy3zz1lm',
        },
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    });

    await spots.save();
  }
};

seedDB();
