const mongoose = require('mongoose');
const User = require('./src/models/User');

const createUser = async () => {
  try {
    await mongoose.connect('mongodb://mongodb:27017/orbit');
    const existing = await User.findOne({ email: 'test@gmail.com' });
    if (!existing) {
      await User.create({
        email: 'test@gmail.com',
        password: 'password123',
        name: 'Test User'
      });
      console.log('Test user created');
    } else {
      console.log('Test user exists');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

createUser();