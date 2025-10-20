# 🚀 Быстрый старт LinkShorty Backend

## Установка и запуск

### 1. Установка зависимостей
```bash
pnpm install
```

### 2. Настройка базы данных
Создайте файл `.env` и добавьте настройки базы данных:
```bash
# Скопируйте пример
cp env.example .env

# Отредактируйте .env файл
DATABASE_URL="postgresql://username:password@localhost:5432/linkshorty?schema=public"
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
PORT=3000
NODE_ENV=development
```

### 3. Применение миграций
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. Запуск сервера
```bash
# Режим разработки
pnpm dev

# Или сборка и запуск
pnpm build
pnpm start
```

### 5. Тестирование API
```bash
node test-api.js
```

## Основные endpoints

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход в систему  
- `GET /api/auth/profile` - Профиль пользователя (требует токен)

## Примеры запросов

### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpassword123"}'
```

### Вход
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpassword123"}'
```

### Профиль
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Структура проекта

```
src/
├── controllers/authController.ts  # Логика аутентификации
├── middleware/auth.ts            # JWT middleware
├── routes/authRoutes.ts          # Маршруты API
├── app.ts                        # Настройка Express
└── server.ts                     # Запуск сервера
```

## Следующие шаги

1. Настройте PostgreSQL базу данных
2. Создайте файл `.env` с вашими настройками
3. Запустите миграции: `pnpm prisma migrate dev`
4. Запустите сервер: `pnpm dev`
5. Протестируйте API: `node test-api.js`

## Безопасность

- ✅ Пароли хешируются с bcrypt
- ✅ JWT токены с 24-часовым сроком действия
- ✅ Валидация данных с Zod
- ✅ Защищенные маршруты с middleware

## Поддержка

При возникновении проблем:
1. Проверьте, что PostgreSQL запущен
2. Убедитесь, что файл `.env` настроен правильно
3. Проверьте логи сервера
4. Убедитесь, что все зависимости установлены: `pnpm install`
