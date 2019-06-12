const mongoose = require('mongoose');
const slug = require('slugs');

mongoose.Promise = global.Promise;


const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
});


function updateSlug(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // explicit return to stop it from running
  }

  this.slug = slug(this.name);
  next();

  // @TODO: make slugs unique
}
storeSchema.pre('save', updateSlug);

module.exports = mongoose.model('Store', storeSchema);
