export default class PowerUp {
    constructor(x, y, width, height, type, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.ctx = ctx;
    }

    draw() {
        this.ctx.fillStyle = 'gold';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += 1; // Power-up falling speed
    }
}
