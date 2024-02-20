const Joi = require('joi');

module.exports.spotSchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  image: Joi.string().allow(''),
  description: Joi.string().allow(''),
});

module.exports.reviewSchema = Joi.object({
  body: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
});
