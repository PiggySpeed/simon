// SimonGame
//
// Keeps track of the game state and operates the game
function SimonGame() {
  var KEYS = ['c', 'd', 'e', 'f'];
  var TIME_LIMIT_INITIAL = 5000; // time user has to begin clicking the sequence
  var TIME_LIMIT_INCREMENT = 1500; // additional time added per note
  var TIME_BETWEEN_NOTES = NOTE_DURATION + 250;
  var NOTES = {};

  var difficulty = 1;
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
    if ((currIndex + 1) === difficulty) {
      endGame(true);
      return;
    }

    // player clicks all notes in current sequence
    if ((currIndex + 1) === currSeq.length) {
      currIndex = 0;
      clearTimeout(timeoutFn);
      generateSequence();
      playNextSequence();
      return;
    }

    // continuing as usual in the current sequence
    currIndex++;
  }

  function playNextSequence() {
    disableAllNotes();
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
        beginTimerCountdown(TIME_LIMIT_INITIAL + TIME_LIMIT_INCREMENT * currSeq.length);
      }
    }, TIME_BETWEEN_NOTES);
  }

  // begin the game with a set difficulty level
  function startGame(level) {
    difficulty = level;
    document.getElementById('diff-label').textContent = ' ' + level;

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
    modalIn.setCallback('end', startGame);
    modalIn.setCallback('victory', startGame);
    modalIn.openModal('start');
  };
}

(new SimonGame()).initialize();
