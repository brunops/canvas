(function() {
  var defaultNumberOfDisks = 6;

  var updateButton = document.getElementById('update-disks-btn'),
      input        = document.getElementById('total-disks');

  updateButton.addEventListener('click', function(e) {
    var newTotal = parseInt(input.value, 10);

    // take care of smart-asses
    if (isNaN(newTotal) || newTotal > 10 || newTotal < 1) {
      newTotal = defaultNumberOfDisks;
      input.value = defaultNumberOfDisks;
    }

    TowerAnimation.init(document.getElementById('canvas'), newTotal);
    TowerAnimation.animate();

    e.preventDefault();
  });

})();
