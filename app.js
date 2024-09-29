// Получаем элементы после загрузки страницы
const pianoContainer = document.getElementById('piano');
const timerElement = document.getElementById('timer');
const notationContainer = document.getElementById('notation');

// Определяем синтезатор Tone
let synth;

// Функция для предварительной инициализации аудио-контекста
async function initializeAudio() {
    try {
        // Инициализируем аудио-контекст Tone.js
        await Tone.start();
        synth = new Tone.Synth().toDestination();

        // Пустой звук для разблокировки аудио на iOS
        const unlockSound = new Audio('./sounds/unlock.mp3');
        unlockSound.volume = 0;  // Бесшумный звук
        unlockSound.play();

        console.log("Аудио-контекст Tone.js инициализирован и разблокирован.");
    } catch (error) {
        console.error("Ошибка при инициализации аудио-контекста:", error);
    }
}

// Функция для воспроизведения звука
function playNote(note) {
    if (synth) {
        synth.triggerAttackRelease(note + '4', '8n');
    } else {
        console.error("Синтезатор не инициализирован.");
    }
}

// Убедимся, что все элементы существуют
if (pianoContainer && timerElement && notationContainer) {
    const pianoKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    pianoKeys.forEach(note => {
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

    // Инициализация аудио-контекста при загрузке страницы
    initializeAudio();
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
