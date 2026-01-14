const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'other'],
    required: true
  },
  version: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Technology', technologySchema);
