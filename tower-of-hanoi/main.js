/* global TowerOfHanoi:false, TowerAnimation:false */
(function() {
  'use strict';

  var defaultNumberOfDisks = 6;

  var updateButton = document.getElementById('update-disks-btn'),
      input        = document.getElementById('total-disks'),
      errorMsg     = document.getElementById('error-msg');

  updateButton.addEventListener('click', function(e) {
    var isValidNumber = true,
        newTotal = parseInt(input.value, 10);

    hideMessages();

    // take care of smart-asses
    if (isNaN(newTotal) || newTotal < 1 || Number(newTotal).toString() !== input.value) {
      displaySmartyMsg();
      isValidNumber = false;
    }
    else if (newTotal > 10) {
      displayMaxValueMsg();
      isValidNumber = false;
    }

    // Reset to default value
    if (!isValidNumber) {
      newTotal = defaultNumberOfDisks;
      input.value = defaultNumberOfDisks;
    }

    startAnimation(newTotal);

    e.preventDefault();
  });

  function setMessage(msg) {
    errorMsg.innerHTML = '<span>' + msg + '</span>';
  }

  function displaySmartyMsg() {
    setMessage('Value reset to its default because you are so smart :)');
  }

  function displayMaxValueMsg() {
    setMessage('Max allowed number is 10 - don\'t spend eternity here..');
  }

  function hideMessages() {
    errorMsg.innerHTML = '';
  }

  function startAnimation(totalDisks) {
    var tower = new TowerOfHanoi(totalDisks);
    TowerAnimation.animate(document.getElementById('canvas'), tower);
  }

  // start immediatly
  startAnimation(defaultNumberOfDisks);
})();
