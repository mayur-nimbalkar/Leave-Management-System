// backend/services/registerService.js
import User from "../models/Users.js";
import bcrypt from "bcryptjs";

const registerService = async (userData) => {
  const { first_name, last_name, phone, email, password, role, department } =
    userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("An account with this email already exists");
  }

  const salt = 10
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    first_name,
    last_name,
    phone,
    email,
    password: hashedPassword,
    role,
    department, 
  });

  return {
    _id: newUser._id,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    email: newUser.email,
    role: newUser.role,
    department: newUser.department,
  };
};

export default registerService;
