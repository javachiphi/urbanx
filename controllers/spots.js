const Spot = require('../models/spot');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Items per page
  const skip = (page - 1) * limit;

  const totalSpots = await Spot.countDocuments();
  const spots = await Spot.find({}).skip(skip).limit(limit);
  const totalPages = Math.ceil(totalSpots / limit);

  res.render('spots/index', { spots, page, totalPages });
};

module.exports.renderNewForm = async (req, res) => {
  res.render('spots/new');
};

module.exports.createSpot = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  console.log('hey response', geoData.body.features[0].geometry);
  // console.log(response.body.features[0].geometry.coordinates);
  const { title, location, description } = req.body;
  const spot = new Spot({ title, location, description });
  //handle the case where the user doesn't enter a location or the location is not found
  spot.geometry = geoData.body.features[0].geometry;
  spot.author = req.user._id;
  spot.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  await spot.save();

  req.flash('success', 'Spot created successfully!');
  res.redirect(`/spots/${spot._id}`);
};

module.exports.showSpot = async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');

  if (!spot) {
    req.flash('error', 'Cannot find that spot!');
    return res.redirect('/spots');
  }
  res.render('spots/show', { spot });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id);

  if (!spot) {
    req.flash('error', 'Cannot find that spot!');
    return res.redirect('/spots');
  }

  res.render('spots/edit', { spot });
};

module.exports.updateSpot = async (req, res) => {
  const { id } = req.params;
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  const { title, image, description } = req.body;
  const spot = await Spot.findByIdAndUpdate(
    id,
    { title, image, description },
    { runValidators: true, new: true }
  );

  spot.geometry = geoData.body.features[0].geometry;
  const imgs = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  spot.images.push(...imgs);
  await spot.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await spot.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash('success', 'Spot updated successfully!');

  res.redirect(`/spots/${spot._id}`);
};

module.exports.deleteSpot = async (req, res) => {
  const { id } = req.params;
  await Spot.findByIdAndDelete(id);
  req.flash('success', 'Spot deleted successfully!');

  res.redirect('/spots');
};
