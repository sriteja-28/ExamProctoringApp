const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users from the database...");
    const users = await User.findAll();
    console.log("Fetched users:", users);
    res.json(users);
  } catch (err) {
    console.error("Error in getAllUsers:", err.stack);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const result = await User.update({ isActive }, { where: { id } });
    console.log("User status update result:", result);
    res.json({ message: 'User status updated' });
  } catch (err) {
    console.error("Error in updateUserStatus:", err.stack);
    res.status(500).json({ message: 'Error updating user status', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const result = await User.update({ role }, { where: { id } });
    console.log("User role update result:", result);
    res.json({ message: 'User role updated' });
  } catch (err) {
    console.error("Error in updateUserRole:", err.stack);
    res.status(500).json({ message: 'Error updating user role', error: err.message });
  }
};
