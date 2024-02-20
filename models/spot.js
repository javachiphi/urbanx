const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const spotSchema = new Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

// query middleware
spotSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Spot', spotSchema);
