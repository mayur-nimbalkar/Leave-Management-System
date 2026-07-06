import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import LeaveBalance from "../models/LeaveBalance.js";

export const registerService = async (userData) => {
  const { firstName, lastName, phone, email, password, role, department } =
    userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("An account with this email already exists");
  }
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    phone,
    email,
    password: hashedPassword,
    role,
    department,
  });
  await LeaveBalance.create({
    employeeId: newUser._id,
  });
  const tokenPayload = {
    userId: newUser._id,
    email: newUser.email,
    role: newUser.role,
    department: newUser.department,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    _id: newUser._id,
    firstName,
    lastName,
    email,
    role,
    department,
    token,
  };
};

export const loginService = async (loginData) => {
  const { email, password } = loginData;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }
  const tokenPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    department: user.department,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
    },
    token: token,
  };
};
