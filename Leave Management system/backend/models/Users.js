import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please add a first name"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Please add a last name"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["HOD", "Staff"],
      default: "Staff",
    },
    department: {
      type: String,
      required: [true, "Please add a department"],
      trim: true,
      enum: ["IT", "HR", "Finance", "Marketing"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;
