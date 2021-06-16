const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: [true, 'url'],
    validate: {
      validator: validator.isURL,
      message: 'Адрес введен неверно',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});
module.exports = mongoose.model('article', articleSchema);
