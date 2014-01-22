(function() {
  var defaultNumberOfDisks = 6;

  var updateButton = document.getElementById('update-disks-btn'),
      input        = document.getElementById('total-disks'),
      controls     = document.getElementById('controls'),
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
    TowerAnimation.animate(document.getElementById('canvas'), totalDisks);
  }

  // start immediatly
  startAnimation(defaultNumberOfDisks);
})();
