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
  'https://res.cloudinary.com',
  'https://images.unsplash.com',
];

module.exports.sessionConfig = {
  name: 'session',
  secret: 'hey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
