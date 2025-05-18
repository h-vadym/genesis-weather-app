# Genesis Weather App

Це серверний застосунок для підписки на оновлення погоди електронною поштою. Користувачі можуть підписатись на сповіщення про погоду для вибраного міста, підтвердити свою пошту, отримувати щоденні оновлення та відписатись у будь-який момент.

## Live Demo

Задеплоєний застосунок доступний тут:  
👉 [https://genesis-weather-app.onrender.com](https://genesis-weather-app.onrender.com)

## Технології

- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**
- **Nodemailer**
- **OpenWeather API**
- **EJS**
- **Scheduler (cron)**
- **Jest**
- **Docker**

## Команди

### Основні

```bash
# Збірка проєкту
npm run build

# Запуск у продакшн-режимі
npm run start:prod

# Запуск у дев-режимі
npm run start:dev
```

### Тести
```bash
# Усі тести (unit + e2e)
npm run test

# Лише unit-тести
npm run test:unit

# Лише e2e-тести
npm run test:e2e
```

### Налаштування середовища
Файл `.env.example` містить змінні середовища, які потрібно заповнити перед запуском.
Використовується для налаштування бази даних, API погоди та SMTP.

