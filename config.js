module.exports.connectSrcUrls = [
  'https://api.mapbox.com',
  'https://events.mapbox.com',
];

module.exports.scriptSrcUrls = [
  'https://api.mapbox.com',
  'https://events.mapbox.com',
  'https://cdn.jsdelivr.net',
];

module.exports.styleSrcUrls = [
  'https://api.mapbox.com',
  'https://events.mapbox.com',
  'https://cdn.jsdelivr.net',
];

module.exports.imgSrcUrls = [
  'https://res.cloudinary.com/drqzbwrjf/',
  'https://images.unsplash.com',
];

const MongoStore = require('connect-mongo');

// 'mongodb://localhost:27017/urbanx // for local development
const secret = process.env.SECRET || 'heyhey';

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_DB_URL,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on('error', function (e) {
  console.log('Session Store Error', e);
});

module.exports.sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
