window.onload = (function() {

  function Ball(x, y, radius, color) {
    this.init(x, y, radius, color);
  }

  Ball.prototype.init = function(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  };

  Ball.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
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

    setInterval(this.tick.bind(this), 500);
  };

  BouncingBalls.prototype.bindEvents = function() {
    var self = this;

    this.canvas.addEventListener('click', function(e) {
      var randomColor = BouncingBalls.colors[Math.floor(Math.random() * BouncingBalls.colors.length)];
      self.add(e.pageX - self.canvas.offsetLeft, e.pageY - self.canvas.offsetTop, 5, randomColor);
    });
  };

  BouncingBalls.prototype.tick = function() {
    this.draw();
  };

  BouncingBalls.prototype.add = function(x, y, radius, color) {
    var newBall = new Ball(x, y, radius, color);
    newBall.draw(this.context);

    this.collection.push(newBall);
  };

  BouncingBalls.prototype.draw = function() {
    for (var i = 0; i < this.collection.length; ++i) {
      this.collection[i].draw(this.context);
    }
  };

  new BouncingBalls();
})();
