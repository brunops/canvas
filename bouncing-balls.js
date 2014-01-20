window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function() {

  function Ball(x, y, radius, color) {
    this.init(x, y, radius, color);
  }

  Ball.prototype.init = function(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.verticalSpeed = Math.floor(Math.random() * 3) + 1;
    this.horizontalSpeed = Math.floor(Math.random() * 3) + 1;

    // up or down
    this.verticalSpeed *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;

    // left or right
    this.horizontalSpeed *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  };

  Ball.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  };

  Ball.prototype.invertVertical = function() {
    this.verticalSpeed *= -1;
  };

  Ball.prototype.invertHorizontal = function() {
    this.horizontalSpeed *= -1;
  };

  Ball.prototype.tick = function() {
    this.x = this.x + this.horizontalSpeed;
    this.y = this.y + this.verticalSpeed;
  };

  function Particle(x, y, radius, color) {
    this.init(x, y, radius, color);
  }
  // Inherit from Ball
  Particle.prototype = new Ball();

  Particle.prototype.init = function(x, y, radius, color, createdAt) {
    Ball.prototype.init.call(this, x, y, radius, color);

    this.createdAt = createdAt || Date.now();
  };

  // Define some constants
  // Particles are subjected to a bit more physics
  Particle.prototype.gravity = 1.3;
  Particle.prototype.horizontalSpeedDecreaseRate = 0.3;
  Particle.prototype.lifespan = 1000;

  Particle.prototype.tick = function() {
    this.x = this.x + this.horizontalSpeed;
    this.y = this.y + this.verticalSpeed;

    this.horizontalSpeed *= this.horizontalSpeedDecreaseRate;
    this.verticalSpeed *= this.gravity;
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

    balls: [],

    init: function() {
      BouncingBalls.canvas  = document.getElementById('canvas');
      BouncingBalls.context = BouncingBalls.canvas.getContext('2d');

      BouncingBalls.bindEvents();

      BouncingBalls.startAnimateLoop();
    },

    startAnimateLoop: function() {
      requestAnimFrame(BouncingBalls.startAnimateLoop);
      BouncingBalls.tick();
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

      for (var i = 0; i < BouncingBalls.balls.length; ++i) {
        BouncingBalls.balls[i].tick();
        BouncingBalls.handleNewCoords(BouncingBalls.balls[i]);
        BouncingBalls.balls[i].draw(BouncingBalls.context);
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

      if (BouncingBalls.hasBallCollided(ball)) {
        // POW!
        ball.invertHorizontal();
        ball.invertVertical();
      }
    },

    hasBallCollided: function(ball) {
      for (var i = 0; i < BouncingBalls.balls.length; ++i) {
        if (ball !== BouncingBalls.balls[i]
          && BouncingBalls.areColliding(ball, BouncingBalls.balls[i])) {
            return true;
        }
      }

      return false;
    },

    areColliding: function(ball1, ball2) {
      var collided = false,
          distance = Math.sqrt(Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2));

      if (distance <= ball1.radius * 2) {
        collided = true;
      }

      return collided;
    },

    add: function(x, y, radius, color) {

      var newBall = new Ball(x, y, radius, color);

      if ( !BouncingBalls.hasBallCollided(newBall) ) {
        newBall.draw(BouncingBalls.context);
        BouncingBalls.balls.push(newBall);
      }
      else {
        delete newBall;
      }

    }
  };

  BouncingBalls.init();
})();
