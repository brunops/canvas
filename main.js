var TowerAnimation = {
  init: function() {
    this.canvas  = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.updateProportionalSizes();

    this.tower = new TowerOfHanoi(3);

    this.drawTowers();
  },

  updateProportionalSizes: function() {
    this.width = this.canvas.width = this.canvas.clientWidth;
    this.height = this.canvas.height = (this.canvas.clientWidth / 5) * 2;

    // Space between towers
    // In a width of 600, biggest disks have 180px and each spacing 15px
    // Four in total, 2 between towers and 1 before and after the towers
    // The "magic number" comes from 600 / 15 = 40 to keep the proportions
    this.spaceUnit = this.width / 40;

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
  }
};

TowerAnimation.init();
