const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spotSchema = new Schema({
  title: String,
  description: String,
  image: String,
  location: String,
});

module.exports = mongoose.model('Spot', spotSchema);
