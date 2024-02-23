const BaseJoi = require('joi');
const { base } = require('./models/review');
const sanitimizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitimizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.spotSchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required().escapeHTML(),
  // image: Joi.string().allow(''),
  description: Joi.string().allow('').escapeHTML(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  body: Joi.string().required().escapeHTML(),
  rating: Joi.number().required().min(1).max(5),
});
