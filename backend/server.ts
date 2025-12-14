import express from "express";
import * as mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, readFileSync } from "fs";

import todoRoutes from "./routes/todos.js";
import authRoutes from "./routes/auth.js";
import { sessionMiddleware } from "./session.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true,
  }));
app.use(express.json())
app.set('trust proxy', 1)
app.use(sessionMiddleware)

app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

const frontendDistPath = join(__dirname, "../frontend/dist");
if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  
  const indexPath = join(frontendDistPath, "index.html");
  if (existsSync(indexPath)) {
    const indexHtml = readFileSync(indexPath, "utf-8");
    return res.send(indexHtml);
  }
  
  res.status(404).json({ 
    error: "Route not found",
    message: "This is an API server. Please access the frontend application."
  });
});

const uri = `mongodb+srv://${process.env.MONGO_TODO_USER}:${encodeURIComponent(
  process.env.MONGO_TODO_PASSWORD as string
)}@todoapp.gn2y6mx.mongodb.net/${process.env.MONGO_DB}?appName=todoApp&retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT);
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));