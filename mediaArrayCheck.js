const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const sendPhotoToChannel = require('./sendPhoto'); // Импортируем функцию для отправки фото
const sendVideoToChannel = require('./sendVideo'); // Импортируем функцию для отправки видео
const app = express();
const port = 5500;
const portClient = 5501;
const cors = require('cors');
const opn = require('opn');
const { exec } = require('child_process');

function mediaArrayCheck(desktopPath, mediaArray) {
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

module.exports = mediaArrayCheck;
