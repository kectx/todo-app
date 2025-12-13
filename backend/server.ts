import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import todoRoutes from "./routes/todos.ts";
import authRoutes from "./routes/auth.ts";
import { sessionMiddleware } from "./session.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
  }));
app.use(express.json());
app.use(sessionMiddleware)

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

const uri = `mongodb+srv://${process.env.MONGO_TODO_USER}:${encodeURIComponent(process.env.MONGO_TODO_PASSWORD as string)}@todoapp.gn2y6mx.mongodb.net/${process.env.MONGO_DB}?appName=todoApp`;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));
