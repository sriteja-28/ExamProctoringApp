require('dotenv').config();
const { sequelize, User } = require('./models');

const seedUsers = async () => {
  try {
    await sequelize.sync();
    const existingUsers = await User.findAll({ where: { role: 'USER' } });
    if (existingUsers.length > 0) {
      console.log('Users already exist.');
      process.exit(0);
    }
    const user1 = await User.create({
      email: 'user1@example.com',
      password: 'UserPassword123',
      role: 'USER'
    });
    const user2 = await User.create({
      email: 'user2@example.com',
      password: 'UserPassword123',
      role: 'USER'
    });
    console.log('Users created:', user1.email, user2.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

seedUsers();
