const img = document.getElementById('whim-img');
const message = document.getElementById('message');
const rows = Array.from(document.querySelectorAll('.row'));

const defaultImg = '../doNOTtriggerher/images/normal.png';
const triggeredImg = '../doNOTtriggerher/images/trigger.png';
const happyImg = '../doNOTtriggerher/images/happy.png';

const triggerWords = ['jesus', 'musab', 'queer', 'arabs', 'trans'];
const happyWords = ['broke', 'music', 'girls', 'women', 'woman'];
const isHappyGame = Math.random() < 0.5;
const targetWords = isHappyGame ? happyWords : triggerWords;
const targetWord = targetWords[Math.floor(Math.random() * targetWords.length)];
const maxGuesses = 3;

let guessesUsed = 0;
let currentGuess = '';

function evaluateGuess(guess, target) {
  const status = Array(5).fill('absent');
  const targetLetters = target.split('');

  guess.split('').forEach((letter, index) => {
    if (letter === targetLetters[index]) {
      status[index] = 'correct';
      targetLetters[index] = null;
    }
  });

  guess.split('').forEach((letter, index) => {
    if (status[index] !== 'correct') {
      const matchIndex = targetLetters.indexOf(letter);
      if (matchIndex !== -1) {
        status[index] = 'present';
        targetLetters[matchIndex] = null;
      }
    }
  });

  return status;
}

function fillRow(rowIndex, guess, feedback) {
  const cells = Array.from(rows[rowIndex].children);
  guess.split('').forEach((letter, index) => {
    const cell = cells[index];
    cell.textContent = letter;
    cell.classList.add(feedback[index]);
  });
}

function updateCurrentRow() {
  const cells = Array.from(rows[guessesUsed].children);
  cells.forEach((cell, index) => {
    cell.textContent = currentGuess[index] || '';
    cell.classList.remove('correct', 'present', 'absent');
  });
}

function endGame(won) {
  img.hidden = false;
  if (won) {
    img.src = isHappyGame ? happyImg : triggeredImg;
  } else {
    img.src = isHappyGame ? triggeredImg : defaultImg;
  }
  message.textContent = won ? `correct: ${targetWord}` : `you lost broooo it was ${targetWord}`;
}

function handleGuess() {
  const guess = currentGuess;
  const guessLower = guess.toLowerCase();


  const validWords = [...triggerWords, ...happyWords];
  if (!validWords.includes(guessLower)) {
    message.textContent = 'only trigger or happy words count';
    return;
  }

  if (guessesUsed >= maxGuesses) {
    return;
  }

  const feedback = evaluateGuess(guessLower, targetWord);
  fillRow(guessesUsed, guess, feedback);
  guessesUsed += 1;
  currentGuess = '';

  if (guessLower === targetWord) {
    endGame(true);
    return;
  }

  if (guessesUsed >= maxGuesses) {
    endGame(false);
    return;
  }

  message.textContent = `wrong ${maxGuesses - guessesUsed} tries left yatk 3asba`;
}



document.addEventListener('keydown', (e) => {
  if (guessesUsed >= maxGuesses) {
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    if (currentGuess.length === 5) {
      handleGuess();
    }
    return;
  }

  if (e.key === 'Backspace') {
    currentGuess = currentGuess.slice(0, -1);
    updateCurrentRow();
    return;
  }

  if (/^[a-z]$/i.test(e.key) && currentGuess.length < 5) {
    currentGuess += e.key.toLowerCase();
    updateCurrentRow();
  }
});
