const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: Number,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    required: function() {
      return this.jobId === 0;
    }
  },
  mobile: {
    type: String
  },
  linkedin: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  cv: {
    filename: String,
    path: String
  },
  applicationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);