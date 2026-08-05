const img = document.getElementById('whim-img');
const input = document.getElementById('user-input');
const moodFill = document.getElementById('mood-bar-fill');
const moodText = document.getElementById('mood-text');
const moodMessage = document.getElementById('mood-message');

const defaultImg = 'images/normal.png';
const happyImg = 'images/happy.png';
const triggeredImg = 'images/trigger.png';
const happySound = 'audio/happy.mp3';
const triggerSound = 'audio/trigger.mp3';

const triggerWords = ['work', 'job', 'gay', 'jesus', 'musab', 'boobjoob', 'accountability', 'faggot', 'nigger', 'willow', 'sexism', 'father', 'ai', 'ex', 'boyfriend', 'ableton', 'flstudio', 'recording', 'mp4 to mp3', 'downloading', 'doomscroll', 'bullshit', 'queer', 'rich', 'boys', 'arab', 'arabs', 'ayoub', 'boy', 'man', 'men', 'trans'];
const happyWords = ['dnd', 'racism', 'racist', 'language', 'culture', 'blender', 'art', 'poor', 'broke', 'music', 'starter loops', 'production', 'girls', 'creativity', 'unemployment', 'laziness', 'adhd', 'ocd', 'autism', 'cp', 'girl', 'women', 'woman'];
const arabicRegex = /[\u0600-\u06FF]+/;


let moodScore = 0;
let lastCountedWord = '';
let currentWhimState = 'default';
let happyCount = Number(localStorage.getItem('happyCount')) || 0;
let triggerCount = Number(localStorage.getItem('triggerCount')) || 0;



const happyCountEl = document.getElementById('happy-count');
const triggerCountEl = document.getElementById('trigger-count');

function updateMoodDisplay() {
    const safeScore = Math.max(-3, Math.min(3, moodScore));
    const percent = ((safeScore + 3) / 6) * 100;

    moodFill.style.width = `${percent}%`;
    moodFill.style.background = safeScore > 0 ? '#111' : safeScore < 0 ? '#444' : '#999';
    moodText.textContent = `mood: ${safeScore}`;

    if (safeScore <= -3) {
        moodMessage.textContent = 'you got timed out';
    } else if (safeScore >= 3) {
        moodMessage.textContent = 'im adding u to my servetr';
    } else {
        moodMessage.textContent = '';
    }
}

function getLatestWord(text) {

    const words = text.toLowerCase().match(/[a-z0-9\u0600-\u06ff]+/g) || [];
    return words[words.length - 1] || '';
}

function getMoodState(text) {
    const latestWord = getLatestWord(text);
    const isArabicWord = /[\u0600-\u06FF]/.test(latestWord);

    if (happyWords.includes(latestWord)) {
        return 'happy';
    }

    if (triggerWords.includes(latestWord) || isArabicWord) {
        return 'triggered';
    }

    return 'default';
}

function playWhimSound(state) {
    if (!window.Audio) {
        return;
    }

    const soundSrc = state === 'happy' ? happySound : state === 'triggered' ? triggerSound : null;
    if (!soundSrc) {
        return;
    }

    const audio = new Audio(soundSrc);
    audio.volume = 0.7;
    audio.play().catch(() => {




    });
}

function updateCountDisplay() {
    happyCountEl.textContent = `happy count: ${happyCount}`;
    triggerCountEl.textContent = `trigger count: ${triggerCount}`;
}




function renderWhimState() {
    img.classList.remove('triggered', 'happy');

    if (currentWhimState === 'happy') {
        img.src = happyImg;
        img.classList.add('happy');
    } else if (currentWhimState === 'triggered') {
        img.src = triggeredImg;
        img.classList.add('triggered');
    } else {
        img.src = defaultImg;
    }
}

function updateWhimState(text) {
    const state = getMoodState(text);

    if (state === 'happy' || state === 'triggered') {
        if (currentWhimState !== state) {
            currentWhimState = state;
            playWhimSound(state);
        }
    } else if (!text.trim()) {
        currentWhimState = 'default';
    }

    renderWhimState();
}

input.addEventListener('input', (e) => {
    if (input.disabled) {
        return;
    }

    const text = e.target.value.toLowerCase();
    updateWhimState(text);

    const latestWord = getLatestWord(text);
    const state = getMoodState(text);

    if (latestWord && latestWord !== lastCountedWord) {
        if (state === 'happy') {
            moodScore = Math.min(3, moodScore + 1);
            happyCount += 1;
            localStorage.setItem('happyCount', happyCount);
        } else if (state === 'triggered') {
            moodScore = Math.max(-3, moodScore - 1);
            triggerCount += 1;
            localStorage.setItem('triggerCount', triggerCount);
        }

        lastCountedWord = latestWord;
    }


    
    updateMoodDisplay();
    updateCountDisplay();
    if (moodScore <= -3) {
        input.disabled = true;
        input.placeholder = 'you got timed out';
        document.body.classList.add('timed-out');
    }
});

updateMoodDisplay();