import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// Схемы валидации с помощью Zod
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Имя пользователя должно содержать минимум 3 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

const loginSchema = z.object({
  username: z.string().min(1, "Имя пользователя обязательно"),
  password: z.string().min(1, "Пароль обязателен"),
});

export const register = async (req: Request, res: Response) => {
  try {
    // Валидация входных данных
    const validatedData = registerSchema.parse(req.body);
    const { username, password } = validatedData;

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Пользователь с таким именем уже существует",
      });
    }

    // Хешируем пароль
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создаем нового пользователя
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });

    // Создаем JWT токен
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Ошибка валидации",
        errors: error.issues,
      });
    }

    console.error("Ошибка при регистрации:", error);
    res.status(500).json({
      message: "Внутренняя ошибка сервера при регистрации",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Валидация входных данных
    const validatedData = loginSchema.parse(req.body);
    const { username, password } = validatedData;

    // Находим пользователя по имени
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({
        message: "Неверное имя пользователя или пароль",
      });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Неверное имя пользователя или пароль",
      });
    }

    // Создаем JWT токен
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "24h",
    });

    res.json({
      message: "Успешный вход в систему",
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Ошибка валидации",
        errors: error.issues,
      });
    }

    console.error("Ошибка при входе:", error);
    res.status(500).json({
      message: "Внутренняя ошибка сервера при входе",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user устанавливается middleware authenticateToken
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Пользователь не аутентифицирован" });
    }

    res.json({
      user: req.user,
    });
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    res.status(500).json({
      message: "Внутренняя ошибка сервера при получении профиля",
    });
  }
};
