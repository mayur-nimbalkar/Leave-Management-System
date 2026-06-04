import express from "express";
import { applyLeaveController } from "../controllers/leaveController.js";
import { authGuard } from "../middlewares/authGuard.js";
import Leave from "../models/Leave.js";
import { validateLeaveInputs } from "../middlewares/leaveMiddleware.js";

const router = express.Router();

router.post("/apply", authGuard, validateLeaveInputs, applyLeaveController);

export default router;