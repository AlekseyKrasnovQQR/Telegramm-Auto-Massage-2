async function submitForm() {
  const TOKEN = document.getElementById('TOKEN').value;
  const CHAT_ID = document.getElementById('CHAT_ID').value;
  const URL_API = document.getElementById('URL_API').value;
  const INTERVAL = document.getElementById('INTERVAL').value;
  const desktopPath = document.getElementById('desktopPath').value;
  const destinationFolderPath = document.getElementById('destinationFolderPath').value;
  const formData = {
    TOKEN: TOKEN,
    CHAT_ID: CHAT_ID,
    URL_API: URL_API,
    INTERVAL: INTERVAL,
    desktopPath: desktopPath,
    destinationFolderPath: destinationFolderPath,
  };

  try {
    const response = await fetch('http://localhost:5500/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const result = await response.json();
      console.log(result);
    } else {
      console.error('Произошла ошибка при выполнении запроса');
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}


const token = () => {
  alert(
    'Получение токена' +
     'https://www.youtube.com/watch?v=fyISLEvzIec&ab_channel=Parsemachine '
    
  )
}
const chat_id = () => {
  alert(
    ' Получение chat_id https://lumpics.ru/how-find-out-chat-id-in-telegram/'
  )
}
const url = () => {
  alert(
    'Вставьте https://api.telegram.org/bot + ваш токен'
  )
}
const interval = () => {
  alert(
    'Интервал между отправками файлов в канал'
  )
}
const onePath = () => {
  alert(
    'Введите путь к папке, из которой будут выгружаться файлы в канал'
  )
}
const twoPath = () => {
  alert(
    'Введите путь к папке, в которую будут выгружаться файлы после отправки'
  )
}