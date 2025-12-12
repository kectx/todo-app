import express from "express";
import Todo from "../models/todo.ts";
import { requireSession } from "../middleware/auth.ts";
import "../types/express.d.ts";

const router = express.Router();

router.get("/", requireSession, async (req, res) => {
  try {
    const uid = (req.session as any).user.uid;
    if (!uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const todos = await Todo.find({ userId: uid }).lean();
    res.json(todos);
  } catch (error: any) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

router.post("/", requireSession, async (req, res) => {
  try {
    const uid = (req.session as any).user.uid;
    const { text, dueDate, done } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: "Text is required and must be a non-empty string" });
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: "Text must be less than 1000 characters" });
    }

    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
    }

    const newTodo = new Todo({
      text: text.trim(),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      done: done === true,
      userId: uid
    });
    
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error: any) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

router.put("/:id", requireSession, async (req, res) => {
  try {
    const uid = (req.session as any).user.uid;
    const { id } = req.params;
    const { text, dueDate, done } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const updateData: any = {};

    if (text !== undefined) {
      if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: "Text must be a non-empty string" });
      }
      if (text.length > 1000) {
        return res.status(400).json({ error: "Text must be less than 1000 characters" });
      }
      updateData.text = text.trim();
    }

    if (dueDate !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
      }
      updateData.dueDate = dueDate;
    }

    if (done !== undefined) {
      updateData.done = done === true;
    }

    const updated = await Todo.findOneAndUpdate(
      { _id: id, userId: uid },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updated);
  } catch (error: any) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

router.delete("/:id", requireSession, async (req, res) => {
  try {
    const uid = (req.session as any).user.uid;
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const deleted = await Todo.findOneAndDelete({ _id: id, userId: uid });

    if (!deleted) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error: any) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;
