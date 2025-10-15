const { User } = require('../../../models/User');

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);  // Renaming variable to avoid conflict

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = { deleteUser };
