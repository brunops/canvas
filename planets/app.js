(function () {
  // Initialize the list of images that will be used
  var imgs = {
    sun: null,
    moon: null,
    earth: null
  };

  // Get drawing context from canvas
  var ctx = document.getElementById('canvas').getContext('2d');

  // Get images by id
  for (var i in imgs) {
    imgs[i] = document.getElementById(i);
  }

  // Render scene
  setInterval(render, 100);

  function render() {
    var time = new Date(),
        s = ( (2 * Math.PI) / 6 ) * time.getSeconds(),
        m = ( (2 * Math.PI) / 6000 ) * time.getMinutes();

    // empty Canvas
    ctx.clearRect(0, 0, 300, 300);

    // New items are always drawn under old items (for shadows)
    ctx.globalCompositionOperation = 'destination-over';

    ctx.save();
      // Drawing at 0, 0 = drawing at 150, 150 (center of canvas)
      ctx.translate(150, 150);

      // Rotate canvas to earth's position
      ctx.rotate( (s + m) / 10 );

      // Move 105 pixels out
      ctx.translate(105, 0);

      // The fill for the shadow (which will be
      // faded in order to see through it)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.strokeStyle = 'rgba(0, 153, 255, 0.4';

      // Draw shadow rectangle
      ctx.fillRect(0, -12, 50, 24);

      // Draw Earth
      ctx.drawImage(imgs.earth, -16, -16);

      ctx.save();
        // Rotate the canvas, relative to the rotation of the earth
        ctx.rotate(s + m);

        // Position the moon in orbit
        ctx.translate(0, 28.5);

        // Draw moon
        ctx.drawImage(imgs.moon, 8, 8);
      ctx.restore();
    ctx.restore();

    // Draw earth's orbit
    ctx.beginPath();
      ctx.arc(150, 150, 105, 0, Math.PI * 2, false);
    ctx.stroke();

    // Draw sun
    ctx.save();
      // Drawing at 0, 0 = drawing at 150, 150 (center of canvas)
      ctx.translate(150, 150);

      ctx.drawImage(imgs.sun, -32, -32);
    ctx.restore();
  }

}());


















