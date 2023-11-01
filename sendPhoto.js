const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
 // Импортируем функцию для отправки видео
const app = express();
const port = 5500;
const portClient = 5501;
const cors = require('cors');
const opn = require('opn');
const { exec } = require('child_process');

function sendPhotoToChannel(filePath, CHAT_ID, URL_API, destinationFolderPath) {
  URL_API = URL_API + '/sendPhoto'
  const form = new FormData();
  form.append('chat_id', CHAT_ID);
  
  // Определяем тип файла на основе его расширения
  const fileExtension = path.extname(filePath).toLowerCase();
  
  if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png' || fileExtension === '.gif') {
    form.append('photo', fs.createReadStream(filePath));
  } else {
    console.error('Неизвестный тип файла: ' + fileExtension);
    return;
  }
  
  axios
    .post(URL_API, form, {
      headers: {
        ...form.getHeaders(),
      },
    })
    .then((response) => {
      if (response.data.ok) {
        console.log('Фото было успешно отправлено в канал!');
  
        // Перемещаем файл в другую папку после отправки
        const sourceFilePath = filePath;
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
        console.error('Произошла ошибка при отправке фото:', response.data);
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
}

module.exports = sendPhotoToChannel;
