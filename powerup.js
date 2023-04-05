export default class PowerUp {
    constructor(x, y, width, height, type, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.ctx = ctx;
        this.color = 'gold';
    }

    draw() {

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + this.height);
        this.ctx.lineTo(this.x + this.width / 2, this.y);
        this.ctx.lineTo(this.x + this.width, this.y + this.height);
        this.ctx.lineTo(this.x, this.y + this.height);
        this.ctx.fillStyle = this.color;

        // Add glow effect
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 50 * (this.y / 600);
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        this.ctx.fill();
        this.ctx.closePath();

        // Reset the shadow properties
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;

    }

    update() {
        this.y += 1; // Power-up falling speed
    }
}
