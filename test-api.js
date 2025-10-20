// Простой скрипт для тестирования API аутентификации
const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Тестирование API аутентификации LinkShorty\n');

  try {
    // Тест 1: Проверка базового маршрута
    console.log('1. Тестирование базового маршрута...');
    const baseResponse = await makeRequest('GET', '/');
    console.log(`   Статус: ${baseResponse.status}`);
    console.log(`   Ответ: ${JSON.stringify(baseResponse.data, null, 2)}\n`);

    // Тест 2: Регистрация пользователя
    console.log('2. Тестирование регистрации пользователя...');
    const registerData = {
      username: 'testuser',
      password: 'testpassword123'
    };
    
    const registerResponse = await makeRequest('POST', '/api/auth/register', registerData);
    console.log(`   Статус: ${registerResponse.status}`);
    console.log(`   Ответ: ${JSON.stringify(registerResponse.data, null, 2)}`);
    
    let token = null;
    if (registerResponse.status === 201 && registerResponse.data.token) {
      token = registerResponse.data.token;
      console.log('   ✅ Токен получен успешно\n');
    } else {
      console.log('   ❌ Ошибка при регистрации\n');
    }

    // Тест 3: Вход в систему
    console.log('3. Тестирование входа в систему...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', registerData);
    console.log(`   Статус: ${loginResponse.status}`);
    console.log(`   Ответ: ${JSON.stringify(loginResponse.data, null, 2)}`);
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      token = loginResponse.data.token;
      console.log('   ✅ Вход выполнен успешно\n');
    } else {
      console.log('   ❌ Ошибка при входе\n');
    }

    // Тест 4: Получение профиля
    if (token) {
      console.log('4. Тестирование получения профиля...');
      const profileResponse = await makeRequest('GET', '/api/auth/profile', null, token);
      console.log(`   Статус: ${profileResponse.status}`);
      console.log(`   Ответ: ${JSON.stringify(profileResponse.data, null, 2)}`);
      
      if (profileResponse.status === 200) {
        console.log('   ✅ Профиль получен успешно\n');
      } else {
        console.log('   ❌ Ошибка при получении профиля\n');
      }
    }

    // Тест 5: Попытка доступа без токена
    console.log('5. Тестирование доступа без токена...');
    const noTokenResponse = await makeRequest('GET', '/api/auth/profile');
    console.log(`   Статус: ${noTokenResponse.status}`);
    console.log(`   Ответ: ${JSON.stringify(noTokenResponse.data, null, 2)}`);
    
    if (noTokenResponse.status === 401) {
      console.log('   ✅ Защита работает корректно\n');
    } else {
      console.log('   ❌ Ошибка в защите маршрута\n');
    }

    console.log('🎉 Тестирование завершено!');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    console.log('\n💡 Убедитесь, что сервер запущен: pnpm dev');
  }
}

// Запуск тестов
testAPI();
