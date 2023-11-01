const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

function sendVideoToChannel(filePath, CHAT_ID, TOKEN, URL_API, destinationFolderPath) {
  const form = new FormData();
  form.append('chat_id', CHAT_ID);

  // Определяем тип файла на основе его расширения
  const fileExtension = path.extname(filePath).toLowerCase();

  if (fileExtension === '.mp4' || fileExtension === '.avi' || fileExtension === '.mov') {
    form.append('video', fs.createReadStream(filePath));

    axios
      .post(`${URL_API}/sendVideo`, form, {
        headers: {
          ...form.getHeaders(),
        },
        params: { token: TOKEN } // Передача токена как параметра
      })
      .then((response) => {
        if (response.data.ok) {
          console.log('Видео было успешно отправлено в канал!');

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
}

module.exports = sendVideoToChannel;

