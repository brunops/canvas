window.onload = (function() {

  function Ball(x, y, radius, color) {
    this.init(x, y, radius, color);
  }

  Ball.prototype.init = function(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.verticalSpeed = Math.floor(Math.random() * 3) + 2;
    this.horizontalSpeed = Math.floor(Math.random() * 3) + 2;

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

  var BouncingBalls = {
    colors: [
      'red',
      'blue',
      'indigo',
      '#b4d455',
      'slateblue',
      '#333',
      'orange'
    ],

    collection: [],

    init: function() {
      BouncingBalls.canvas  = document.getElementById('canvas');
      BouncingBalls.context = BouncingBalls.canvas.getContext('2d');

      BouncingBalls.bindEvents();

      setInterval(BouncingBalls.tick, 20);
    },

    bindEvents: function() {
      BouncingBalls.canvas.addEventListener('click', function(e) {
        var randomColor = BouncingBalls.colors[Math.floor(Math.random() * BouncingBalls.colors.length)],
            rect = e.target.getBoundingClientRect(),
            x = e.offsetX || e.pageX - rect.left - window.scrollX,
            y = e.offsetY || e.pageY - rect.top - window.scrollY;

        BouncingBalls.add(x, y, 10, randomColor);
      });
    },

    tick: function() {
      // this weird statement clears the canvas
      BouncingBalls.canvas.width = BouncingBalls.canvas.width;

      for (var i = 0; i < BouncingBalls.collection.length; ++i) {
        BouncingBalls.collection[i].tick();
        BouncingBalls.handleNewCoords(BouncingBalls.collection[i]);
        BouncingBalls.collection[i].draw(BouncingBalls.context);
      }
    },

    handleNewCoords: function(ball) {
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.invertHorizontal();
      }

      if (ball.x + ball.radius > BouncingBalls.canvas.width) {
        ball.x = BouncingBalls.canvas.width - ball.radius;
        ball.invertHorizontal();
      }

      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.invertVertical();
      }

      if (ball.y + ball.radius > BouncingBalls.canvas.height) {
        ball.y = BouncingBalls.canvas.height - ball.radius;
        ball.invertVertical();
      }
    },

    add: function(x, y, radius, color) {
      var newBall = new Ball(x, y, radius, color);
      newBall.draw(BouncingBalls.context);

      BouncingBalls.collection.push(newBall);
    }
  };

  BouncingBalls.init();
})();
