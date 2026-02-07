import userModel from "../models/user.model.js";

export async function getCurrentUser(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({
        message: "UserId is not found.",
        success: false,
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "Error during User found by ID.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User found",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during getCurrentUser.",
      error: error.message,
      success: false,
    });
  }
}
