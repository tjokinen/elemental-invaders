export default class Projectile {
    constructor(x, y, width, height, type, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.ctx = ctx;
        this.color = 'white';
    }

    draw() {
        switch (this.type) {
            case 'fire':
                this.color = 'red';
                break;
            case 'water':
                this.color = 'blue';
                break;
            case 'earth':
                this.color = 'green';
                break;
            case 'air':
                this.color = 'white';
                break;
            default:
                this.color = 'white';
        }

        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.color;

        // Add glow effect
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        this.ctx.fill();
        this.ctx.closePath();

        // Reset the shadow properties
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    }

    update() {
        this.y -= 5;
    }
}