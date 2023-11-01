const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const sendPhotoToChannel = require('./sendPhoto'); // Импортируем функцию для отправки фото
// const sendVideoToChannel = require('./sendVideo'); // Импортируем функцию для отправки видео
const app = express();
const port = 5500;
const portClient = 5501;
const cors = require('cors');
const opn = require('opn');
const { exec } = require('child_process');
// сервер чек
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Сервер работает\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Сервер запущен');
});

const shutdownTime = 7200000  ; // Один день в миллисекундах

// Устанавливаем таймер на остановку сервера через заданное время
const shutdownTimer = setTimeout(() => {
  console.log('Ограничение времени работы сервера истекло. Сервер останавливается.');
  server.close(); // Закрыть сервер
  process.exit(0); // Выход из Node.js-приложения
}, shutdownTime);




app.use(express.static(__dirname));
app.use(cors());
app.listen(portClient, () => {
  console.log(`Сервер запущен на порту ${portClient}`);
  opn(`http://localhost:${portClient}/index.html`);
});

// Переменные для хранения данных из запроса
let TOKEN = null;
let CHAT_ID = null;
let URL_API = null;
let INTERVAL = null;
let destinationFolderPath = '';
let desktopPath = '';
const mediaArray = [];

// Функция для считывания файлов в папке
function mediaArrayCheck(desktopPath) {
  fs.readdir(desktopPath, (err, files) => {
    if (err) {
      console.error('Ошибка чтения папки:', err);
      return;
    } else {
      mediaArray.push(...files);
    }
    console.log(mediaArray);
  });
}

app.use(express.json());

// Функция для отправки медиафайлов с интервалом
function sendMediaWithInterval() {
  
  let currentIndex = 0;
  const sendMediaInterval = setInterval(() => {
    if (currentIndex < mediaArray.length) {
      const mediaPath = path.join(desktopPath, mediaArray[currentIndex]);
      const fileExtension = path.extname(mediaPath).toLowerCase();

      if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png' || fileExtension === '.gif') {
        sendPhotoToChannel(mediaPath, CHAT_ID, URL_API, destinationFolderPath); // Используем функцию для отправки фото
      } else if (fileExtension === '.mp4' || fileExtension === '.avi' || fileExtension === '.mov') {
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('video', fs.createReadStream(mediaPath));
      
        axios
          .post(`${URL_API}/sendVideo`, form, {
            headers: {
              ...form.getHeaders(),
            },
            params: { token: TOKEN },
          })
          .then((response) => {
            if (response.data.ok) {
              console.log('Видео было успешно отправлено в канал!');
      
              // Перемещаем файл в другую папку после отправки
              const sourceFilePath = mediaPath;
              const fileName = path.basename(sourceFilePath);
              const destinationFilePath = path.join(destinationFolderPath, fileName);
      
              fs.rename(sourceFilePath, destinationFilePath, (err) => {
                if (err) {
                  console.error('Произошла ошибка при перемещении файла: ', err);
                } else {
                  console.log('Файл успешно перемещен в целевую папку.');
                }
              });
            } else {
              console.error('Произошла ошибка при отправке видео:', response.data);
            }
          })
          .catch((error) => {
            if (error.response) {
              console.error('Ответ от сервера:', error.response.data);
              console.error('Статус:', error.response.status);
            } else if (error.request) {
              console.error('Запрос был сделан, но ответ не получен');
            } else {
              console.error('Произошла ошибка:', error.message);
            }
          });
      } else {
        console.error('Неизвестный тип файла: ' + fileExtension);
      }
          
           
        
      
      
      
      currentIndex++;
      console.log(`Медиа отправлено ${currentIndex}`);
    } else {
      console.log('Все медиа-файлы были отправлены');
      clearInterval(sendMediaInterval);
      console.log('Интервал очищен');
      mediaArray.length = 0;
      mediaArrayCheck(desktopPath);
      console.log('Массив обновлен');
      sendMediaWithInterval()
    }
  }, INTERVAL);
}

app.post('/submit-form', (req, res) => {
  
  const body = req.body;

  if (!body || !body.TOKEN) {
    return res.status(400).json({ error: 'Missing TOKEN in the request body' });
  }

  // Получаем значения из формы и присваиваем их соответствующим переменным
  TOKEN = body.TOKEN;
  CHAT_ID = body.CHAT_ID;
  URL_API = body.URL_API;
  INTERVAL = body.INTERVAL;
  desktopPath = body.desktopPath;
  destinationFolderPath = body.destinationFolderPath;
  mediaArrayCheck(desktopPath)
  // Возвращаем данные клиенту
  res.json({
    TOKEN: TOKEN,
    CHAT_ID: CHAT_ID,
    URL_API: URL_API,
    INTERVAL: Number(INTERVAL),
    DESC_PATH: desktopPath,
    DEST_PATH: destinationFolderPath
  });

  // Вызываем функцию для считывания файлов
  mediaArrayCheck(desktopPath);

  // Вызываем функцию для отправки медиафайлов с интервалом
  sendMediaWithInterval();
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

app.post('/test', (req, res) => {
  // Отправляем данные из запроса в ответ
  res.json({
    TOKEN: TOKEN,
    CHAT_ID: CHAT_ID,
    URL_API: URL_API,
    INTERVAL: INTERVAL,
    DESC_PATH: desktopPath,
    DEST_PATH: destinationFolderPath
  });
});
