import express from "express";
import { verifyToken } from "../middleware/auth.ts";
import User from "../models/user.ts";

const router = express.Router();

router.post("/sync", verifyToken, async (req, res) => {
  const firebaseUser = (req as any).user;

  let user = await User.findOne({ uid: firebaseUser.uid });
  if (!user) {
    user = await User.create({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
    });
  }
  (req.session as any).user = { uid: user.uid, email: user.email };

  res.json({ message: "Sync success", uid: user.uid });
});

router.get("/me", (req, res) => {
  if (!(req.session as any).user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json((req.session as any).user);
});

router.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({ message: "Logged out" });
  });
});

export default router;
