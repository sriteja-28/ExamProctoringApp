require('dotenv').config();
const { sequelize, User } = require('./models');

const deleteAdmin = async () => {
  try {
    await sequelize.sync();
    const admin = await User.findOne({ where: { role: 'ADMIN' } });
    if (!admin) {
      console.log('No admin found.');
      process.exit(0);
    }
    await admin.destroy();
    console.log('Admin deleted.');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting admin:', error);
    process.exit(1);
  }
};

deleteAdmin();
