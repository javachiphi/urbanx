const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spotSchema = new Schema({
  title: String,
  image: String,
  description: String,
  image: String,
  location: String,
});

module.exports = mongoose.model('Spot', spotSchema);
