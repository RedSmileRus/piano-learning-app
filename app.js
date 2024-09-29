// Получаем элементы после загрузки страницы
const pianoContainer = document.getElementById('piano');
const timerElement = document.getElementById('timer');
const notationContainer = document.getElementById('notation');
const octaveDownButton = document.getElementById('octave-down');
const octaveUpButton = document.getElementById('octave-up');
const currentOctaveElement = document.getElementById('current-octave');

// Определяем синтезатор Tone.js
let synth = new Tone.Synth().toDestination();
let currentOctave = 4; // Текущая октава

// Функция для воспроизведения звука
function playNote(note) {
    synth.triggerAttackRelease(note + currentOctave, '8n');
}

// Функция для обновления отображения текущей октавы
function updateOctaveDisplay() {
    currentOctaveElement.textContent = currentOctave;
}

// Добавляем обработчики для кнопок управления октавами
octaveDownButton.addEventListener('click', () => {
    if (currentOctave > 1) {
        currentOctave--;
        updateOctaveDisplay();
    }
});

octaveUpButton.addEventListener('click', () => {
    if (currentOctave < 7) {
        currentOctave++;
        updateOctaveDisplay();
    }
});

// Убедимся, что все элементы существуют
if (pianoContainer && timerElement && notationContainer) {
    // Очищаем контейнер клавиш перед добавлением новых
    pianoContainer.innerHTML = '';

    const pianoKeys = [
        { note: 'C', isBlack: false },
        { note: 'C#', isBlack: true },
        { note: 'D', isBlack: false },
        { note: 'D#', isBlack: true },
        { note: 'E', isBlack: false },
        { note: 'F', isBlack: false },
        { note: 'F#', isBlack: true },
        { note: 'G', isBlack: false },
        { note: 'G#', isBlack: true },
        { note: 'A', isBlack: false },
        { note: 'A#', isBlack: true },
        { note: 'B', isBlack: false }
    ];

    pianoKeys.forEach(key => {
        const button = document.createElement('button');
        button.textContent = key.note;
        button.classList.add(key.isBlack ? 'black-key' : 'white-key');
        button.addEventListener('click', () => playNote(key.note));
        pianoContainer.appendChild(button);
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

    renderer.resize(600, 200);  // Увеличиваем размер нотного стана
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 40, 500);

    stave.addClef('treble').setContext(context).draw();

    const notes = [
        new VF.StaveNote({ clef: 'treble', keys: ['c/4'], duration: 'q' }),
        // Добавьте другие ноты
    ];

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);
    
    // Инициализируем отображение текущей октавы
    updateOctaveDisplay();
} else {
    console.error("Не удалось найти элементы на странице.");
}
