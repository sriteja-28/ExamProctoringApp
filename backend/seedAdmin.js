require('dotenv').config();
const { sequelize, User } = require('./models');

const seedAdmin = async () => {
  try {
    await sequelize.sync();
    const existingAdmin = await User.findOne({ where: { role: 'ADMIN' } });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const admin = await User.create({
      email: process.env.Admin_Email,
      password: process.env.Admin_Password,
      role: 'ADMIN'
    });

    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();

