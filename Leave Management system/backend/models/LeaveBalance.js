import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    CL: { type: Number, default: 12 }, // Casual Leave
    SL: { type: Number, default: 10 }, // Sick Leave
    EL: { type: Number, default: 15 }, // Earned Leave or Privilege Leave
    ML: { type: Number, default: 182 }, // Maternity Leave (6 months)
    compOff: { type: Number, default: 0 }, // Compensatory Off
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  { timestamps: true },
);

const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceSchema);
export default LeaveBalance;
