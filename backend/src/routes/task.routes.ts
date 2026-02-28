import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId: req.userId!,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error",error });
  }
});

router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const completed =
      typeof req.query.completed === "string"
        ? req.query.completed
        : undefined;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const page =
      typeof req.query.page === "string"
        ? parseInt(req.query.page)
        : 1;

    const limit =
      typeof req.query.limit === "string"
        ? parseInt(req.query.limit)
        : 5;

    const where: any = {
      userId: req.userId,
    };

    if (completed !== undefined) {
      where.completed = completed === "true";
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.task.count({ where });

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    if (typeof req.params.id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const id = req.params.id;
    const { completed, title } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(typeof completed === "boolean" && { completed }),
        ...(typeof title === "string" && { title }),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    if (typeof req.params.id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const id = req.params.id;

    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;