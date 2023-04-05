export function drawPowerUpDurationBar(ctx, canvas, powerUpDuration) {
    if (powerUpDuration > 0) {
      const barWidth = 200;
      const barHeight = 10;
      const x = (canvas.width - barWidth) / 2;
      const y = 30;
      const remainingWidth = (barWidth * powerUpDuration) / 100;
  
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(x, y, barWidth, barHeight);
  
      ctx.fillStyle = 'lime';
      ctx.fillRect(x, y, remainingWidth, barHeight);
    }
  }
  
  // Move other UI drawing functions from main.js to ui.js
  // ...
  