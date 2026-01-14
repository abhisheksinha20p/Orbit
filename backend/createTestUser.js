require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingUser = await User.findOne({ email: 'test@gmail.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    const user = await User.create({
      email: 'test@gmail.com',
      password: 'password123',
      name: 'Test User'
    });

    console.log('Test user created:', user.email);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

createTestUser();