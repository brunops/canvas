function TowerOfHanoi(totalDisks) {
  this.init(totalDisks);
}

TowerOfHanoi.prototype.init = function(totalDisks) {
  this.totalDisks = totalDisks;

  this.towers = [[], [], []];

  for (var i = totalDisks; i > 0; --i) {
    this.towers[0].push(i);
  };
};

TowerOfHanoi.prototype.getSolutionSteps = function() {
  var solutionSteps = this.hanoiSteps(this.totalDisks, 1, 3);

  // reset it
  this.init(this.totalDisks);

  return [this.towersDeepClone()].concat(solutionSteps);
};

TowerOfHanoi.prototype.hanoiSteps = function(totalDisks, fromTower, toTower) {
  // Base case
  // only one disk, just move it
  if (totalDisks === 1) {
    this.towers[toTower - 1].push(this.towers[fromTower - 1].pop());

    return [this.towersDeepClone()];
  }
  // Solve N-1 Subproblem
  else {
    var helperTower = 6 - fromTower - toTower; // because 1 + 2 + 3 === 6

    var step1 = this.hanoiSteps(totalDisks - 1, fromTower, helperTower);

    var myStep = this.hanoiSteps(1, fromTower, toTower);

    var step2 = this.hanoiSteps(totalDisks - 1, helperTower, toTower);


    return step1.concat(myStep).concat(step2);
  }
};

TowerOfHanoi.prototype.towersDeepClone = function() {
  var towersClone = [];

  for (var i = 0; i < this.towers.length; ++i) {
    towersClone.push(this.towers[i].slice(0));
  }

  return towersClone;
};
