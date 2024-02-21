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
      geometry: { coordinates: [-119.571615, 37.737363], type: 'Point' },
      images: [
        {
          url: 'https://res.cloudinary.com/drqzbwrjf/image/upload/v1708487372/UrbanX/ne6x2wmz27z5ormqnyao.png',
          filename: 'UrbanX/ne6x2wmz27z5ormqnyao',
        },
        {
          url: 'https://res.cloudinary.com/drqzbwrjf/image/upload/v1708488145/UrbanX/kmogvlmoq1nrpw0vgxq4.png',
          filename: 'UrbanX/kmogvlmoq1nrpw0vgxq4',
        },
      ],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    });

    await spots.save();
  }
};

seedDB();
