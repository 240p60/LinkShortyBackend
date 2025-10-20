import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";

// Загружаем переменные окружения
dotenv.config();

const app: express.Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use("/api/auth", authRoutes);

// Базовый маршрут
app.get("/", (_req, res) => {
  res.json({
    message: "LinkShorty Backend API",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile",
      },
    },
  });
});

// Обработчик ошибок
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Ошибка сервера:", err);
    res.status(500).json({
      message: "Внутренняя ошибка сервера",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  },
);

// Обработчик для несуществующих маршрутов
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Маршрут не найден",
    path: req.originalUrl,
  });
});

export default app;
