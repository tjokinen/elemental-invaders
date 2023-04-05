export default class Particle {
    constructor(x, y, size, color, ctx) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.ctx = ctx;
        this.velocity = {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5
        };
        this.alpha = 1;
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}
