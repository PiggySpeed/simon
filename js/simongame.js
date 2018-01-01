// SimonGame
//
// Keeps track of the game state and operates the game
function SimonGame() {
  var KEYS = ['c', 'd', 'e', 'f'];
  var NOTES = {};

  var difficulty = 1;
  var time_limit_increment = 1500; // additional time allocated per note, reduced based on difficulty
  var time_limit_initial = 5000; // time user has to begin clicking the sequence, reduced based on difficulty
  var time_between_notes = NOTE_DURATION + 250; // how fast notes are played
  var currSeq = [];
  var currIndex = 0;
  var timeoutFn = null;
  var intervalFn = null;
  var modalIn = null;

  function resetState() {
    currSeq = [];
    currIndex = 0;
    clearTimeout(timeoutFn);
    clearInterval(intervalFn);
    timeoutFn = null;
    intervalFn = null;
  }

  function setDifficulty(level) {
    difficulty = level;

    time_limit_initial = {
      "5": 5000,
      "10": 3500,
      "15": 2000
    }[level];

    time_limit_increment = {
      "5": 1500,
      "10": 1000,
      "15": 750
    }[level];

    time_between_notes = {
      "5": NOTE_DURATION + 500,
      "10": NOTE_DURATION + 250,
      "15": NOTE_DURATION
    }[level];

    document.getElementById('diff-label').textContent = ' ' + level;
  }

  function pickRandomBox(){
    return KEYS[Math.floor(Math.random() * 4)];
  }

  function generateSequence() {
    if (currSeq.length === 0) {
      currSeq = [pickRandomBox()];
      return;
    }

    return currSeq.push(pickRandomBox());
  }

  function disableAllNotes() {
    KEYS.forEach(function(key) {
      NOTES[key].disable();
    });
  }

  function enableAllNotes() {
    KEYS.forEach(function(key) {
      NOTES[key].enable();
    });
  }

  function hideTimer() {
    document.getElementById('timer').style.display = 'none';
    document.getElementById('timer-spinner').style.animation = 'none';
    document.getElementById('timer-filler').style.animation = 'none';
    document.getElementById('timer-mask').style.animation = 'none';
  }

  function showTimer(time) {
    document.getElementById('timer').style.display = 'flex';
    document.getElementById('timer-spinner').style.animation = 'rota ' + time/1000 + 's linear 1';
    document.getElementById('timer-filler').style.animation = 'fill ' + time/1000 + 's steps(1, end) 1';
    document.getElementById('timer-mask').style.animation = 'mask ' + time/1000 + 's steps(1, end) 1';
  }

  function beginTimerCountdown(time) {
    showTimer(time);
    clearTimeout(timeoutFn);
    timeoutFn = setTimeout(function(){
      hideTimer();
      endGame(false);
    }, time);
  }

  function handleClick(key) {
    // clicked wrong button
    if (key !== currSeq[currIndex]) {
      endGame(false);
      return;
    }

    // player passes victory condition
    if ((currIndex + 1) === parseInt(difficulty)) {
      endGame(true);
      return;
    }

    // player clicks all notes in current sequence
    if ((currIndex + 1) === currSeq.length) {
      currIndex = 0;
      clearTimeout(timeoutFn);

      // add a brief pause
      disableAllNotes();
      setTimeout(function() {
        generateSequence();
        playNextSequence();
      }, 1000);
      return;
    }

    // continuing as usual in the current sequence
    currIndex++;
  }

  function playNextSequence() {
    hideTimer();

    // play all notes in currSeq that the user needs to imitate
    var n = 0;
    intervalFn = setInterval(function(){
      if (n < currSeq.length) {
        NOTES[currSeq[n]].play();
        n++;
      } else {
        enableAllNotes();
        clearInterval(intervalFn);

        // give user time to think
        beginTimerCountdown(time_limit_initial + time_limit_increment * currSeq.length);
      }
    }, time_between_notes);
  }

  // begin the game with a set difficulty level
  function startGame(level) {
    setDifficulty(level);
    generateSequence();
    playNextSequence();
  }

  function endGame(userWon) {
    if (userWon) {
      modalIn.openModal('victory');
    }
    else {
      modalIn.openModal('end');
      document.getElementById('end-modal-text').textContent = ' ' + (currSeq.length - 1);
    }

    resetState();
  }

  this.initialize = function() {
    KEYS.forEach(function(key) {
      NOTES[key] = new NoteBox(key, handleClick);
    }.bind(this));

    modalIn = new Modals();
    modalIn.initialize();
    modalIn.setCallback('start', startGame);
    modalIn.openModal('start');
  };
}

(new SimonGame()).initialize();
