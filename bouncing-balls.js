window.onload = (function() {

  function Ball(x, y, radius, color) {
    this.init(x, y, radius, color);
  }

  Ball.prototype.init = function(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.verticalSpeed = Math.floor(Math.random() * 5) + 1;
    this.horizontalSpeed = Math.floor(Math.random() * 5) + 1;

    // up === true
    // down === false
    this.vertical = Math.floor(Math.random() * 2) === 1;

    // right ===  true
    // left === false
    this.horizontal = Math.floor(Math.random() * 2) === 1;
  };

  Ball.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  };

  Ball.prototype.invertVertical = function() {
    this.vertical = !this.vertical;
  };

  Ball.prototype.invertHorizontal = function() {
    this.horizontal = !this.horizontal;
  };

  Ball.prototype.tick = function() {
    this.x = this.x + (this.horizontal ? this.horizontalSpeed : - this.horizontalSpeed);
    this.y = this.y + (this.vertical ? - this.verticalSpeed : this.verticalSpeed);
  };

  function BouncingBalls() {
    this.init();
  }

  BouncingBalls.colors = [
    'red',
    'blue',
    'indigo',
    '#b4d455',
    'slateblue',
    '#333',
    'orange'
  ];

  BouncingBalls.prototype.init = function() {
    this.collection = [];

    this.canvas  = document.getElementById('canvas');
    this.context = canvas.getContext('2d');

    this.bindEvents();

    setInterval(this.tick.bind(this), 20);
  };

  BouncingBalls.prototype.bindEvents = function() {
    var self = this;

    this.canvas.addEventListener('click', function(e) {
      var randomColor = BouncingBalls.colors[Math.floor(Math.random() * BouncingBalls.colors.length)];
      self.add(e.pageX - self.canvas.offsetLeft, e.pageY - self.canvas.offsetTop, 5, randomColor);
    });
  };

  BouncingBalls.prototype.tick = function() {
    canvas.width = canvas.width;
    for (var i = 0; i < this.collection.length; ++i) {
      this.collection[i].tick();
      this.handleNewCoords(this.collection[i]);
      this.collection[i].draw(this.context);
    }
  };

  BouncingBalls.prototype.handleNewCoords = function(ball) {
    if (ball.x < 0
        || ball.x > this.canvas.width) {
      ball.invertHorizontal();
    }

    if (ball.y < 0
        || ball.y > this.canvas.height) {
      ball.invertVertical();
    }
  };

  BouncingBalls.prototype.add = function(x, y, radius, color) {
    var newBall = new Ball(x, y, radius, color);
    newBall.draw(this.context);

    this.collection.push(newBall);
  };

  new BouncingBalls();
})();
