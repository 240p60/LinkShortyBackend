import { PrismaClient } from "../generated/prisma";
import app from "./app";

const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Функция для корректного завершения работы
const gracefulShutdown = async () => {
  console.log("Получен сигнал завершения. Закрываем сервер...");

  try {
    await prisma.$disconnect();
    console.log("Соединение с базой данных закрыто.");
    process.exit(0);
  } catch (error) {
    console.error("Ошибка при закрытии соединения с БД:", error);
    process.exit(1);
  }
};

// Обработчики сигналов завершения
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(
    `📖 API документация доступна по адресу: http://localhost:${PORT}`,
  );
  console.log("🔐 Эндпоинты аутентификации:");
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/profile`);
});

// Обработка ошибок сервера
server.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Порт ${PORT} уже используется`);
  } else {
    console.error("❌ Ошибка сервера:", error);
  }
  process.exit(1);
});

export default server;
