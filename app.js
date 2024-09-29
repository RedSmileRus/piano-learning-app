// Получаем элементы после загрузки страницы
const pianoContainer = document.getElementById('piano');
const timerElement = document.getElementById('timer');
const notationContainer = document.getElementById('notation');

// Словарь для хранения аудиофайлов Howler.js
const audioFiles = {};

// Функция для воспроизведения звука
function playNote(note) {
    if (audioFiles[note]) {
        audioFiles[note].play();
    } else {
        console.error(`Аудиофайл для ноты ${note} не найден.`);
    }
}

// Убедимся, что все элементы существуют
if (pianoContainer && timerElement && notationContainer) {
    const pianoKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    pianoKeys.forEach(note => {
        // Создаем звуковые объекты Howler.js и сохраняем их в словаре
        audioFiles[note] = new Howl({
            src: [`./sounds/${note}.mp3`],
            html5: true, // Используем HTML5 Audio, чтобы обойти некоторые ограничения на iOS
        });

        // Создаем клавиши пианино
        const key = document.createElement('button');
        key.textContent = note;
        key.addEventListener('click', () => playNote(note));
        pianoContainer.appendChild(key);
    });

    let timeLeft = 30;

    const timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Действия по окончании времени
        }
    }, 1000);

    // VexFlow - Рисование нотного стана
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(notationContainer, VF.Renderer.Backends.SVG);

    renderer.resize(500, 200);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 40, 400);

    stave.addClef('treble').setContext(context).draw();

    const notes = [
        new VF.StaveNote({ clef: 'treble', keys: ['c/4'], duration: 'q' }),
        // Добавьте другие ноты
    ];

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);
} else {
    console.error("Не удалось найти элементы на странице.");
}

// Проверка на наличие объекта Telegram Web Apps
if (window.Telegram.WebApp) {
    const telegramWebApp = window.Telegram.WebApp;
    
    // Инициализация приложения
    telegramWebApp.ready();

    // Получение информации о пользователе
    const user = telegramWebApp.initDataUnsafe.user;
    console.log(`Привет, ${user.first_name}!`);
    
    // Пример отправки сообщения пользователю
    document.getElementById('sendMessageButton').addEventListener('click', () => {
        telegramWebApp.sendData("Привет от вашего пианино-бота!");
    });
} else {
    console.error("Telegram Web Apps не обнаружен.");
}
