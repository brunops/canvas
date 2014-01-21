var TowerAnimation = {
  init: function() {
    this.canvas  = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.updateProportionalSizes();

    this.tower = new TowerOfHanoi(4);

    // no strokes
    this.context.strokeStyle = 'black';

    this.drawTowers();
    this.drawDisks();
  },

  updateProportionalSizes: function() {
    this.width = this.canvas.width = this.canvas.clientWidth;
    this.height = this.canvas.height = (this.canvas.clientWidth / 6) * 2;

    // Space between towers
    // In a width of 600, biggest disks have 180px and each spacing 15px
    // Four in total, 2 between towers and 1 before and after the towers
    // The "magic number" comes from 600 / 15 = 40 to keep the proportions
    this.spaceUnit = this.width / 40;

    // Little spacing between disks, so they're not glued (5px in the example)
    this.spaceBetweenDisks = this.spaceUnit / 3;

    // Towers base
    this.towersBaseHeight = this.spaceUnit * 1.5;
    this.towersBaseWidth  = this.width - (this.spaceUnit * 2);
    this.towersBaseX = this.spaceUnit;
    this.towersBaseY = this.height - this.spaceUnit - this.towersBaseHeight;

    // Towers
    this.towerWidth = this.spaceUnit;
    this.towerHeight = this.height - (this.spaceUnit * 5);

    // Disks
    // remember the 180px? that's about it..
    this.biggestDisk = this.spaceUnit * 12;
  },

  drawTowers: function() {
    this.context.beginPath();
    this.context.fillStyle = 'black';

    // Base
    this.context.rect(this.towersBaseX, this.towersBaseY, this.towersBaseWidth, this.towersBaseHeight);
    this.context.fill();
    this.context.stroke();

    // The 3 Towers
    for (var i = 0; i < 3; i++) {
      var towerX = this.spaceUnit                 // left space
                   + (this.biggestDisk * (i + 1)) // previous towers full width (disk size)
                   - (this.biggestDisk / 2)       // centralize disk
                   - (this.towerWidth / 2)        // centralize tower itself
                   + (this.spaceUnit * i),        // space between towers

          towerY = this.spaceUnit * 4;            // leave space at the top for animation

      this.context.rect(towerX, towerY, this.towerWidth, this.towerHeight);
      this.context.fill();
      this.context.stroke();
    }
  },

  drawDisks: function(towerState) {
    towerState = [[4, 3, 2, 1], [1,3,2,3], [3,1,2]];
    var diskSizes = this.getDiskSizes();

    console.log(diskSizes);

    this.context.beginPath();
    for (var tower = 0; tower < towerState.length; tower++) {
      for (var disk = 0; disk < towerState[tower].length; disk++) {

        var diskWidth  = diskSizes[towerState[tower][disk] - 1],

            diskX      = this.spaceUnit                     // left space
                         + (this.biggestDisk * (tower + 1)) // previous towers max width
                         - (this.biggestDisk / 2)           // centralize in tower
                         - (diskWidth / 2)                  // centralize disk itself
                         + (this.spaceUnit * tower),        // space between towers

            diskHeight = this.spaceUnit,

            diskY      = this.towersBaseY       // strats from towersBaseY
                         - ((diskHeight + this.spaceBetweenDisks) * (disk + 1)); // go up the diskHeight plus its spacing according to is position in the tower

        console.log(diskX, diskY, diskWidth, diskHeight);

        // some blue
        this.context.fillStyle = '#325FA2';
        this.context.rect(diskX, diskY, diskWidth, diskHeight);
        this.context.fill();
        this.context.stroke();
      }
    }
  },

  getDiskSizes: function() {
    // Because Tower may have different total number of disks
    // Their sizes must be proportionally calculated
    var diskSizes = [];

    for (var i = 0; i < this.tower.totalDisks; ++i) {
      diskSizes.push((this.biggestDisk / this.tower.totalDisks) * (i + 1));
    }

    return diskSizes;
  }
};

TowerAnimation.init();
