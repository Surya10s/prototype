const basejoi = require('joi')
const { model } = require('mongoose')
const sanitizeHtml = require('sanitize-html');
const apperror = require('./utils/errorapp');
const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'any.invalid': '{{#label}} must be "custom"',
  },
  rules: {
    escapeHtml: {
      validate (value,err){
        const clean = sanitizeHtml(value, {
          allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
          allowedAttributes: {
            'a': [ 'href' ]
          },
        });
        if(clean!==value) throw new apperror('cannot use html code',400)
        return clean
      }

    },
  },
});

const joi = basejoi.extend(extension);

module.exports.campgroundshema = joi.object({
    campground: joi.object({
      title : joi.string().required().escapeHtml(),
      // image : joi.string().required(),
      description : joi.string().required().escapeHtml(),
      Price : joi.number().required().min(0).max(10000),
      location:joi.string().escapeHtml(),
      deleteimage:joi.array(),
    }).required()
   })

   module.exports.reviewschema = joi.object({
   Review: joi.object({
    rating : joi.number().required(),
    body: joi.string().required().escapeHtml()
   }).required()
   })