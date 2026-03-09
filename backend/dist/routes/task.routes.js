"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || typeof title !== "string") {
            return res.status(400).json({ message: "Title is required" });
        }
        const task = await prisma_1.prisma.task.create({
            data: {
                title,
                userId: req.userId,
            },
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
router.get("/", auth_middleware_1.authenticate, async (req, res) => {
    try {
        const completed = typeof req.query.completed === "string"
            ? req.query.completed
            : undefined;
        const search = typeof req.query.search === "string"
            ? req.query.search
            : undefined;
        const page = typeof req.query.page === "string"
            ? parseInt(req.query.page)
            : 1;
        const limit = typeof req.query.limit === "string"
            ? parseInt(req.query.limit)
            : 5;
        const where = {
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
        const tasks = await prisma_1.prisma.task.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
        });
        const total = await prisma_1.prisma.task.count({ where });
        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            tasks,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
router.put("/:id", auth_middleware_1.authenticate, async (req, res) => {
    try {
        if (typeof req.params.id !== "string") {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const id = req.params.id;
        const { completed, title } = req.body;
        const existingTask = await prisma_1.prisma.task.findFirst({
            where: {
                id,
                userId: req.userId,
            },
        });
        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        const updatedTask = await prisma_1.prisma.task.update({
            where: { id },
            data: {
                ...(typeof completed === "boolean" && { completed }),
                ...(typeof title === "string" && { title }),
            },
        });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
router.delete("/:id", auth_middleware_1.authenticate, async (req, res) => {
    try {
        if (typeof req.params.id !== "string") {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const id = req.params.id;
        const existingTask = await prisma_1.prisma.task.findFirst({
            where: {
                id,
                userId: req.userId,
            },
        });
        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        await prisma_1.prisma.task.delete({
            where: { id },
        });
        res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=task.routes.js.map