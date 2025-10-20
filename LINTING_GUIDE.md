# 🛠️ Руководство по линтингу LinkShorty Backend

## Настроенные правила

### Biome
- **Кавычки**: Только двойные кавычки (`"`) во всех TypeScript и JavaScript файлах
- **Точки с запятой**: Обязательны в конце каждого выражения
- **Запятые**: Обязательны в конце многострочных объектов/массивов
- **Неиспользуемые переменные**: Запрещены
- **Консоль**: Разрешена (для серверного кода)
- **Форматирование**: Автоматическое форматирование кода
- **Ширина строки**: 80 символов
- **Отступы**: 2 пробела
- **Конец строки**: LF

## Команды

### Проверка кода
```bash
# Проверить код на ошибки линтера
pnpm lint

# Проверить форматирование
pnpm format:check

# Комплексная проверка (линтер + форматирование)
pnpm check
```

### Автоматическое исправление
```bash
# Исправить ошибки линтера автоматически
pnpm lint:fix

# Отформатировать код
pnpm format

# Исправить все проблемы (безопасные исправления)
pnpm check:fix

# Исправить все проблемы (включая небезопасные исправления)
pnpm biome check --write --unsafe src/
```

## Правила форматирования

### ✅ Правильно
```typescript
import { Request, Response } from "express";

const message = "Hello, World!";
const user = {
  id: 1,
  name: "John",
};

function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### ❌ Неправильно
```typescript
import { Request, Response } from 'express'; // Одинарные кавычки

const message = 'Hello, World!'; // Одинарные кавычки
const user = {
  id: 1,
  name: 'John' // Отсутствует запятая
}

function greet(name: string): string {
  return `Hello, ${name}!` // Отсутствует точка с запятой
}
```

## Интеграция с IDE

### VS Code
Установите расширение:
- Biome

Добавьте в настройки VS Code (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### WebStorm/IntelliJ
1. Включите Biome в настройках: `Languages & Frameworks > JavaScript > Code Quality Tools > Biome`
2. Установите "Reformat code" при сохранении

## CI/CD

Добавьте проверки в ваш CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Lint and format check
  run: pnpm check
```

## Исключения

Файлы, исключенные из проверки линтера:
- `node_modules/`
- `dist/`
- `generated/`
- `*.js` (кроме исходных файлов)
- `*.d.ts`
- `pnpm-lock.yaml`

## Решение проблем

### Ошибка "quotes"
```bash
# Автоматически исправить все проблемы с кавычками
pnpm check:fix
```

### Комплексное исправление
```bash
# Исправить все проблемы (включая небезопасные исправления)
pnpm biome check --write --unsafe src/
```

### Проблемы с импортами
Убедитесь, что все импорты используют двойные кавычки:
```typescript
// ✅ Правильно
import express from "express";
import { Router } from "express";

// ❌ Неправильно
import express from 'express';
import { Router } from 'express';
```

