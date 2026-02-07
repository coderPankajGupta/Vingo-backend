import jwt from "jsonwebtoken";

export default async function genToken(userId) {
  try {
    const token = jwt.sign({ userId }, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log(error.message);
  }
}
