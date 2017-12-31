
// SimonGame
//
// Keeps track of the game state and operates the game
function SimonGame() {
  var KEYS = ['c', 'd', 'e', 'f'];
  var TIME_LIMIT = 2500; // time user has to click the next note in sequence
  var TIME_BETWEEN_NOTES = NOTE_DURATION + 500;
  var DIFFICULTY = 10;
  var NOTES = {};

  var currSeq = [];
  var currIndex = 0;
  var timeoutFn = null;
  var gameEnd = false;

  this.initialize = function() {
    KEYS.forEach(function (key) {
      NOTES[key] = new NoteBox(key, handleClick);
    }.bind(this));

    KEYS.concat(KEYS.slice().reverse()).forEach(function(key, i) {
      setTimeout(NOTES[key].play.bind(null, key), i * NOTE_DURATION);
    });

    startGame();
  };

  function resetState() {
    currSeq = [];
    currIndex = 0;
    timeoutFn = null;
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

  function beginTimerCountdown() {
    console.log('starting timeout...');
    timeoutFn = setTimeout(function(){
      endGame(false, 'timeout');
    }, TIME_LIMIT);
  }

  function handleClick(key) {
    // stop timer
    clearTimeout(timeoutFn);

    // clicked wrong button
    if (key !== currSeq[currIndex]) {
      endGame(false, 'wrong button clicked');
      return;
    }

    // player passes victory condition
    if ((currIndex + 1) === DIFFICULTY) {
      endGame(true);
      return;
    }

    // player clicks all notes in current sequence
    if ((currIndex + 1) === currSeq.length) {
      currIndex = 0;
      generateSequence();
      playNextSequence();
      return;
    }

    // continuing as usual in the current sequence
    currIndex++;
    beginTimerCountdown();
  }

  function playNextSequence() {
    // play all notes in currSeq that the user needs to imitate
    var n = 0;
    var intervalFn = setInterval(function(){
      if (n < currSeq.length) {
        NOTES[currSeq[n]].play();
        n++;
      } else {
        clearInterval(intervalFn);
      }
    }, TIME_BETWEEN_NOTES);
  }

  function startGame() {
    generateSequence();
    playNextSequence();
  }

  function endGame(userWon, reason) {
    resetState();

    if (userWon) {
      console.log('you won the game!');
      return;
    }

    console.log('you lost the game... ' + reason);
  }
}
console.log('12123');
// var newGame = new SimonGame();
// newGame.initialize();
(new SimonGame()).initialize();