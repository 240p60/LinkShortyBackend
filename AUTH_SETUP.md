# Настройка аутентификации LinkShorty Backend

## Описание

Система аутентификации для LinkShorty Backend включает:
- Регистрацию пользователей с хешированием паролей
- Вход в систему с JWT токенами
- Middleware для защиты маршрутов
- Валидацию данных с помощью Zod

## Структура проекта

```
src/
├── controllers/
│   └── authController.ts    # Контроллеры аутентификации
├── middleware/
│   └── auth.ts              # Middleware для проверки JWT токенов
├── routes/
│   └── authRoutes.ts        # Маршруты аутентификации
├── app.ts                   # Настройка Express приложения
└── server.ts                # Запуск сервера
```

## Настройка

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе `env.example`:

```bash
cp env.example .env
```

Отредактируйте `.env` файл:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/linkshorty?schema=public"
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
PORT=3000
NODE_ENV=development
```

### 3. Настройка базы данных

```bash
# Применить миграции
pnpm prisma migrate dev

# Сгенерировать Prisma клиент
pnpm prisma generate
```

### 4. Запуск сервера

```bash
# Режим разработки
pnpm dev

# Сборка и запуск
pnpm build
pnpm start
```

## API Endpoints

### Аутентификация

#### POST /api/auth/register
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

**Ответ:**
```json
{
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": 1,
    "username": "testuser"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Вход в систему

**Тело запроса:**
```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

**Ответ:**
```json
{
  "message": "Успешный вход в систему",
  "user": {
    "id": 1,
    "username": "testuser"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /api/auth/profile
Получение профиля пользователя (требует аутентификации)

**Заголовки:**
```
Authorization: Bearer <your_jwt_token>
```

**Ответ:**
```json
{
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

## Тестирование API

### Используя curl

#### Регистрация:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpassword"}'
```

#### Вход:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpassword"}'
```

#### Получение профиля:
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Используя Postman

1. **Регистрация:**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "username": "testuser",
       "password": "testpassword"
     }
     ```

2. **Вход:**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "username": "testuser",
       "password": "testpassword"
     }
     ```

3. **Профиль:**
   - Method: GET
   - URL: `http://localhost:3000/api/auth/profile`
   - Headers: `Authorization: Bearer YOUR_JWT_TOKEN`

## Безопасность

- Пароли хешируются с помощью bcrypt (10 раундов)
- JWT токены имеют срок действия 24 часа
- Валидация входных данных с помощью Zod
- Обработка ошибок и безопасные сообщения об ошибках

## Следующие шаги

1. Добавьте middleware для защиты других маршрутов
2. Реализуйте систему ролей пользователей
3. Добавьте refresh токены для продления сессий
4. Настройте rate limiting для защиты от брутфорса
5. Добавьте логирование и мониторинг
