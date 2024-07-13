const User = require('../models/userModel');
const axios = require('axios');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const getWeatherData = async (location) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.weatherApiKey}`;
  const response = await axios.get(url);
  return response.data;
};

exports.createUser = async (req, res) => {
  try {
    const { email, location } = req.body;
    const weatherData = await getWeatherData(location);
    const newUser = new User({ email, location, weatherData: [{ date: new Date(), data: weatherData }] });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { location } = req.body;
    const weatherData = await getWeatherData(location);
    const user = await User.findByIdAndUpdate(userId, { location, $push: { weatherData: { date: new Date(), data: weatherData } } }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserWeatherData = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const weatherData = user.weatherData.find(data => data.date.toISOString().split('T')[0] === date);
    res.status(200).json(weatherData || { message: 'No weather data for this date' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });
  const sendWeatherEmail = (email, weatherData) => {
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Weather Report",
      text: `Here is your weather report: ${JSON.stringify(
        weatherData,
        null,
        2
      )}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
  }
  });
  };

      cron.schedule('0 */3 * * *', async () => {
        const users = await User.find();
        for (const user of users) {
          const weatherData = await getWeatherData(user.location);
          sendWeatherEmail(user.email, weatherData);
        }
      });
    
