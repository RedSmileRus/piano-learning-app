// Получаем элементы после загрузки страницы
const pianoContainer = document.getElementById('piano');
const timerElement = document.getElementById('timer');
const notationContainer = document.getElementById('notation');

// Убедимся, что все элементы существуют
if (pianoContainer && timerElement && notationContainer) {
    const pianoKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    pianoKeys.forEach(note => {
        const key = document.createElement('button');
        key.textContent = note;
        key.addEventListener('click', () => playNote(note));
        pianoContainer.appendChild(key);
    });

    function playNote(note) {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(note + '4', '8n');
    }

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
