require('dotenv').config();

module.exports = {
  dbUri: process.env.DB_URI,
  port: process.env.PORT || 3000,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  weatherApiKey: process.env.WEATHER_API_KEY,
};
