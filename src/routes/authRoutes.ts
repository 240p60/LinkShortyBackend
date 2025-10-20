import { Router } from "express";
import { getProfile, login, register } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Маршруты аутентификации
router.post("/register", register);
router.post("/login", login);

// Защищенный маршрут для получения профиля пользователя
router.get("/profile", authenticateToken, getProfile);

export default router;
