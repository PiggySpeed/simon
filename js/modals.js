// Modals
//
// Takes care of modal operations
function Modals() {
  var MODAL_KEYS = ['start', 'end', 'victory'];
  var self = this;

  function handleClick(type) {
    // type is one of: 'start', 'end', or 'victory'
    return function(e) {
      e.stopPropagation();
      self.closeModal(type);
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
      console.log('clicky');
      cb();
      handleClick(type)(e);
    };
  }
}
