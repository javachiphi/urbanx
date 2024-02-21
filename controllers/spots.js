const Spot = require('../models/spot');
const { cloudinary } = require('../cloudinary');

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
  spot.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  await spot.save();
  console.log('sppot', spot);

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
