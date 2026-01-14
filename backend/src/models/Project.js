const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'archived'],
    default: 'planning'
  },
  deploymentStatus: {
    environment: String,
    url: String,
    lastDeployed: Date,
    health: {
      type: String,
      enum: ['healthy', 'degraded', 'down'],
      default: 'healthy'
    }
  },
  technologies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology'
  }],
  deadline: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

projectSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
