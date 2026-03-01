import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/test", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});