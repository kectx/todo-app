import express from "express";
import Todo from "../models/todo.ts";
import { verifyToken } from "../middleware/auth.ts";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const uid = (req as any).user.uid;
  const todos = await Todo.find({ userId: uid });
  res.json(todos);
});

router.post("/", verifyToken, async (req, res) => {
  const uid = (req as any).user.uid;
  const newTodo = new Todo({ ...req.body, userId: uid });
  await newTodo.save();
  res.status(201).json(newTodo);
});

router.put("/:id", verifyToken, async (req, res) => {
  const uid = (req as any).user.uid;
  const updated = await Todo.findOneAndUpdate({ _id: req.params.id, userId: uid }, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const uid = (req as any).user.uid;
  await Todo.findOneAndDelete({ _id: req.params.id, userId: uid });
  res.json({ message: "Deleted" });
});

export default router;
