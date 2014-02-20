/*
 * Bouncing Balls, 2014
 * Author: Bruno Sanches <brunopsanches@gmail.com>
 * MIT Licensed
 */
window.requestAnimFrame = (function(){
  'use strict';
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function() {
  'use strict';

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

  Particle.prototype.init = function(x, y, radius, color) {
    Ball.prototype.init.call(this, x, y, radius, color);

    this.horizontalSpeed = (Math.floor(Math.random() * 1500)) / 1000;
    this.verticalSpeed = (Math.floor(Math.random() * 1300)) / 1000;
    this.horizontalSpeed *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    this.verticalSpeed *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  };

  // Define some constants
  // Particles are subjected to a bit more physics
  Particle.prototype.gravity = 0.05;
  Particle.prototype.horizontalSpeedDecreaseRate = 0.98;

  Particle.prototype.tick = function() {
    this.x = this.x + this.horizontalSpeed;
    this.y = this.y + this.verticalSpeed;

    this.horizontalSpeed *= this.horizontalSpeedDecreaseRate;
    this.verticalSpeed += this.gravity;
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

    particles: [],

    particlesPerExplosion: 25,

    init: function() {
      BouncingBalls.canvas  = document.getElementById('canvas');
      BouncingBalls.context = BouncingBalls.canvas.getContext('2d');

      BouncingBalls.bindEvents();

      BouncingBalls.startAnimateLoop();
    },

    startAnimateLoop: function() {
      window.requestAnimFrame(BouncingBalls.startAnimateLoop);
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

      // Balls
      for (var i = 0; i < BouncingBalls.balls.length; ++i) {
        BouncingBalls.balls[i].tick();
        BouncingBalls.handleNewCoords(BouncingBalls.balls[i], i);
        BouncingBalls.balls[i].draw(BouncingBalls.context);
      }

      // POW!
      BouncingBalls.explodeCollidedBalls();

      // Particles
      var particlesToRemove = 0;
      for (i = 0; i < BouncingBalls.particles.length; ++i) {
        BouncingBalls.particles[i].tick();
        BouncingBalls.particles[i].draw(BouncingBalls.context);
        if (particlesToRemove === i && BouncingBalls.particles[i].y > BouncingBalls.canvas.height) {
          particlesToRemove++;
        }
      }

      if (particlesToRemove) {
        BouncingBalls.particles.splice(0, particlesToRemove);
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

    explodeCollidedBalls: function() {
      var collidedBallsIndex = BouncingBalls.collidedBallsIndex();

      for (var i = collidedBallsIndex.length - 1; i >= 0; --i) {
        BouncingBalls.explodeBall(collidedBallsIndex[i]);
      }
    },

    explodeBall: function(index) {
      var ball = BouncingBalls.balls[index];

      for (var i = 0; i < BouncingBalls.particlesPerExplosion; i++) {
        BouncingBalls.particles.push(new Particle(ball.x, ball.y, 2, ball.color));
      }

      BouncingBalls.balls.splice(index, 1);
    },

    collidedBallsIndex: function() {
      var collidedBalls = {},
          balls = BouncingBalls.balls;

      for (var i = 0; i < BouncingBalls.balls.length; ++i) {
        for (var j = i + 1; j < BouncingBalls.balls.length; j++)  {
          if (BouncingBalls.areColliding(balls[i], balls[j])) {
            collidedBalls[i] = i;
            collidedBalls[j] = j;
          }
        }
      }

      return Object.keys(collidedBalls).sort(function(a, b) { return a - b; });
    },

    areColliding: function(ball1, ball2) {
      var collided = false,
          distance = Math.sqrt(Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2));

      if (distance <= ball1.radius + ball2.radius) {
        collided = true;
      }

      return collided;
    },

    add: function(x, y, radius, color) {
      var newBall = new Ball(x, y, radius, color);

      newBall.draw(BouncingBalls.context);
      BouncingBalls.balls.push(newBall);
    }
  };

  BouncingBalls.init();

})();
