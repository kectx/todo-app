import type { Request, Response, NextFunction } from "express";
import { auth } from "../firebase.js";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await auth.verifyIdToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireSession = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session as any).user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
};

