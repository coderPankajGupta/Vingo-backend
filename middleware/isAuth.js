import jwt from "jsonwebtoken";

export async function isAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decodeToken) {
      return res.status(400).json({
        message: "Token not verifed.",
      });
    }
    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Error is in isAuth function",
    });
  }
}
