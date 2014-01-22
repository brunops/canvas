var TowerAnimation = (function() {
  // Private variables
  // Initialized in the exposed #animate method
  var canvas,
      context,
      tower,
      animationInterval;

  function processSteps(steps) {
    var towerState = steps.shift();

    // Draw first step to start immediatly
    draw(towerState);

    animationInterval = setInterval(function() {
      towerState = steps.shift();

      if (towerState) {
        draw(towerState);
      }
      else {
        clearInterval(animationInterval);
      }
    }, 300);
  }

  function draw(towerState) {
    context.clearRect(0, 0, width, height);
    drawTowers();
    drawDisks(towerState);
  }

  function updateProportionalSizes() {
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = (canvas.clientWidth / 6) * 3;

    // Space between towers
    // In a width of 600, biggest disks have 180px and each spacing 15px
    // Four in total, 2 between towers and 1 before and after the towers
    // The "magic number" comes from 600 / 15 = 40 to keep the proportions
    spaceUnit = width / 40;

    // Little spacing between disks, so they're not glued (5px in the example)
    spaceBetweenDisks = spaceUnit / 2.8;

    // Towers base
    towersBaseHeight = spaceUnit * 1.5;
    towersBaseWidth  = width - (spaceUnit * 2);
    towersBaseX = spaceUnit;
    towersBaseY = height - spaceUnit - towersBaseHeight;

    // Towers
    towerWidth = spaceUnit;
    towerHeight = height - (spaceUnit * 5);

    // Disks
    // remember the 180px? that's about it..
    biggestDisk = spaceUnit * 12;
  }

  function drawTowers() {
    context.beginPath();
    context.fillStyle = 'black';

    // Base
    context.rect(towersBaseX, towersBaseY, towersBaseWidth, towersBaseHeight);
    context.fill();
    context.stroke();

    // The 3 Towers
    for (var i = 0; i < 3; i++) {
      var towerX = spaceUnit                 // left space
                   + (biggestDisk * (i + 1)) // previous towers full width (disk size)
                   - (biggestDisk / 2)       // centralize disk
                   - (towerWidth / 2)        // centralize tower itself
                   + (spaceUnit * i),        // space between towers

          towerY = spaceUnit * 4;            // leave space at the top for animation

      context.rect(towerX, towerY, towerWidth, towerHeight);
      context.fill();
      context.stroke();
    }
  }

  function drawDisks(towerState) {
    var diskSizes = getDiskSizes();

    context.beginPath();
    for (var tower = 0; tower < towerState.length; tower++) {
      for (var disk = 0; disk < towerState[tower].length; disk++) {

        var diskWidth  = diskSizes[towerState[tower][disk] - 1],

            diskX      = spaceUnit                     // left space
                         + (biggestDisk * (tower + 1)) // previous towers max width
                         - (biggestDisk / 2)           // centralize in tower
                         - (diskWidth / 2)             // centralize disk itself
                         + (spaceUnit * tower),        // space between towers

            diskHeight = spaceUnit,

            diskY      = towersBaseY       // strats from towersBaseY
                         - ((diskHeight + spaceBetweenDisks) * (disk + 1)); // go up the diskHeight plus its spacing according to is position in the tower

        // some blue
        context.fillStyle = '#325FA2';
        context.rect(diskX, diskY, diskWidth, diskHeight);
        context.fill();
        context.stroke();
      }
    }
  }

  function getDiskSizes() {
    // Because Tower may have different total number of disks
    // Their sizes must be proportionally calculated
    var diskSizes = [];

    for (var i = 0; i < tower.totalDisks; ++i) {
      diskSizes.push((biggestDisk / tower.totalDisks) * (i + 1));
    }

    return diskSizes;
  }

  return {
    animate: function(canvasElement, towerSize) {
      canvas  = canvasElement;
      context = canvas.getContext('2d');
      tower   = new TowerOfHanoi(towerSize);
      initialized = true;

      // default strokes to black
      context.strokeStyle = 'black';

      updateProportionalSizes();

      // Clear interval if already running
      clearInterval(animationInterval);

      var steps = tower.getSolutionSteps();
      processSteps(steps);
    }
  };
})();
