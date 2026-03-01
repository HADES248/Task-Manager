import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    // Short-lived access token
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" } // short-lived
    );

    // Long-lived refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" } // long-lived
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Send tokens to client (Access token in body, Refresh token in HttpOnly cookie)
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        accessToken,
      });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    let payload: { userId: string };
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { userId: string };
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    // Remove refresh token from DB
    const payload: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { refreshToken: null },
    });
  }

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};