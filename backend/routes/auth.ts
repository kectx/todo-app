import express from "express";
import { verifyToken, requireSession } from "../middleware/auth.js";
import User, { UserDoc } from "../models/user.js"

const router = express.Router();

router.post("/sync", verifyToken, async (req, res) => {
  try {
    const firebaseUser = (req as any).user;

    let user: UserDoc | null = await User.findOne({ uid: firebaseUser.uid });
    if (!user) {
      user = await User.create({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      }) as UserDoc;
    }
    (req.session as any).user = {
      uid: user.uid,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    };

    res.json({ message: "Sync success", uid: user.uid });
  } catch (error: any) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

router.get("/me", async (req, res) => {
  try {
    if (!(req.session as any).user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const uid = (req.session as any).user.uid;
    const user = await User.findOne({ uid }).select("uid email username avatar");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      uid: user.uid,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    });
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
});

router.put("/profile", requireSession, async (req, res) => {
  try {
    const uid = (req.session as any).user.uid;
    const { username, avatar } = req.body;

    const updateData: any = {};

    if (username !== undefined) {
      if (typeof username !== "string") {
        return res.status(400).json({ error: "Username must be a string" });
      }
      const trimmedUsername = username.trim();
      if (trimmedUsername.length === 0) {
        updateData.username = null;
      } else if (trimmedUsername.length > 30) {
        return res.status(400).json({ error: "Username must be 30 characters or less" });
      } else {
        const existingUser = await User.findOne({
          username: trimmedUsername,
          uid: { $ne: uid },
        });
        if (existingUser) {
          return res.status(400).json({ error: "Username already taken" });
        }
        updateData.username = trimmedUsername;
      }
    }

    if (avatar !== undefined) {
      if (avatar === null || avatar === "") {
        updateData.avatar = null;
      } else if (typeof avatar === "string") {
        if (avatar.startsWith("data:image")) {
          const base64Data = avatar.split(",")[1];
          const sizeInBytes = (base64Data.length * 3) / 4;
          if (sizeInBytes > 50000) {
            return res.status(400).json({ error: "Avatar image too large (max 50KB)" });
          }
          updateData.avatar = avatar;
        } else {
          return res.status(400).json({ error: "Invalid avatar format" });
        }
      } else {
        return res.status(400).json({ error: "Avatar must be a string or null" });
      }
    }

    const updatedUser = await User.findOneAndUpdate({ uid }, updateData, {
      new: true,
    }).select("uid email username avatar");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    (req.session as any).user = {
      uid: updatedUser.uid,
      email: updatedUser.email,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
    };

    res.json({
      uid: updatedUser.uid,
      email: updatedUser.email,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
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
