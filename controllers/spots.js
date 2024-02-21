const Spot = require('../models/spot');

module.exports.index = async (req, res) => {
  const spots = await Spot.find({});

  res.render('spots/index', { spots });
};

module.exports.renderNewForm = async (req, res) => {
  res.render('spots/new');
};

module.exports.createSpot = async (req, res) => {
  const { title, location } = req.body;
  const spot = new Spot({ title, location });
  spot.author = req.user._id;
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
  const { title, location, image, description } = req.body;
  const spot = await Spot.findByIdAndUpdate(
    id,
    { title, location, image, description },
    { runValidators: true, new: true }
  );
  req.flash('success', 'Spot updated successfully!');

  res.redirect(`/spots/${spot._id}`);
};

module.exports.deleteSpot = async (req, res) => {
  const { id } = req.params;
  await Spot.findByIdAndDelete(id);
  req.flash('success', 'Spot deleted successfully!');

  res.redirect('/spots');
};
