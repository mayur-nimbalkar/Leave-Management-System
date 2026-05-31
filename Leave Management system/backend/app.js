import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200", // Allows only your Angular app to access this API
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
