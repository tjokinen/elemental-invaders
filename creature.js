export default class Creature {
    constructor(x, y, width, height, type, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.ctx = ctx;
    }

    draw() {
        switch (this.type) {
            case 'fire':
                this.ctx.fillStyle = 'red';
                break;
            case 'water':
                this.ctx.fillStyle = 'blue';
                break;
            case 'earth':
                this.ctx.fillStyle = 'green';
                break;
            case 'air':
                this.ctx.fillStyle = 'white';
                break;
            default:
                this.ctx.fillStyle = 'white';
        }
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += 1;
    }
}