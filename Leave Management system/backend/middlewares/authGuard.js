import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authGuard = (req, res, next) => {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. Authorization header missing" });
  }
  try {
    const token = tokenHeader.split(" ")[1];
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Invalid token, Access denied", error: error.message });
  }
};
