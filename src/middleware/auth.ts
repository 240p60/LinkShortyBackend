import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// Расширяем интерфейс Request для добавления user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<undefined | Response> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Токен доступа не предоставлен" });
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };

    // Проверяем, что пользователь все еще существует
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Недействительный токен" });
    }
    return res
      .status(500)
      .json({ message: "Ошибка сервера при проверке токена" });
  }
};
