const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  date: Date,
  data: Object,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  location: { type: String, required: true },
  weatherData: [weatherDataSchema],
});

module.exports = mongoose.model('User', userSchema);
