// Modals
//
// Takes care of modal operations
function Modals() {
  var MODAL_KEYS = ['start', 'end', 'victory'];
  var DIFFICULTY_LEVELS = ['5', '10', '15'];
  var self = this;

  var difficulty = DIFFICULTY_LEVELS[0];

  function handleClick(type) {
    // type is one of: 'start', 'end', or 'victory'
    return function(e) {
      e.stopPropagation();
      self.closeModal(type);

      // if (type === 'end') {
      //   self.openModal('start');
      // }
    }
  }

  function handleDifficultyClick(key) {
    return function() {
      DIFFICULTY_LEVELS.forEach(function(str) {
        document.getElementById('diff-' + str).style.color = '#FFF';
      });

      difficulty = key;
      document.getElementById('diff-' + key).style.color = '#ffd900';
    }
  }

  this.initialize = function() {
    MODAL_KEYS.forEach(function(key) {
      document.getElementById(key + '-modal-btn').onclick = handleClick(key);
    });
  };

  this.openModal = function(type) {
    // type is one of: 'start', 'end', or 'victory'
    var modal = document.getElementById(type + '-modal');
    modal.style.display = 'block';

    if (type === 'start') {
      document.getElementById('diff-5').style.color = '#ffd900';
      DIFFICULTY_LEVELS.forEach(function(str) {
        document.getElementById('diff-' + str).onclick = handleDifficultyClick(str);
      })
    }
  };

  this.closeModal = function(type) {
    // type is one of: 'start', 'end', or 'victory'
    var modal = document.getElementById(type + '-modal');
    modal.style.display = 'none';
  };

  // attach custom callbacks to modal buttons
  this.setCallback = function(type, cb) {
    // type is one of: 'start', 'end', or 'victory'
    document.getElementById(type + '-modal-btn').onclick = function(e) {
      cb(difficulty);
      handleClick(type)(e);
    };
  };
}
