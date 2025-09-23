import express from "express";
import { verifyToken } from "../middleware/auth.ts";

const router = express.Router();

router.post("/sync", verifyToken, async (req, res) => {
  const user = (req as any).user;
  res.json({ message: "Sync success", uid: user.uid });
});

export default router;
