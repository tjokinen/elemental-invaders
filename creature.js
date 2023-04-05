export default class Creature {
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
                this.drawFlameShape();
                break;
            case 'water':
                this.color = 'blue';
                this.drawRaindropShape();
                break;
            case 'earth':
                this.color = 'green';
                this.drawLeafShape();
                break;
            case 'air':
                this.color = 'white';
                this.drawWindGustShape();
                break;
            default:
                this.color = 'white';
        }
    }

    drawFlameShape() {
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width / 2, this.y - this.height / 2);
        this.ctx.bezierCurveTo(
            this.x + this.width / 2, this.y + this.height * 0.2,
            this.x + this.width * 1.5, this.y + this.height,
            this.x + this.width / 2, this.y + this.height
        );
        this.ctx.bezierCurveTo(
            this.x - this.width / 2, this.y + this.height,
            this.x + this.width / 2, this.y + this.height * 0.2,
            this.x + this.width / 2, this.y - this.height / 2
        );
        this.fillAndAddGlow();
    }

    drawRaindropShape() {

        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width / 2, this.y - this.height / 2);
        this.ctx.bezierCurveTo(
            this.x + this.width / 2, this.y + this.height * 0.2,
            this.x + this.width * 1.5, this.y + this.height,
            this.x + this.width / 2, this.y + this.height
        );
        this.ctx.bezierCurveTo(
            this.x - this.width / 2, this.y + this.height,
            this.x + this.width / 2, this.y + this.height * 0.2,
            this.x + this.width / 2, this.y - this.height / 2
        );
        this.fillAndAddGlow();
    }

    drawLeafShape() {
        // Draw a leaf shape using paths and bezier curves
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.width / 2, this.y);
        this.ctx.bezierCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height / 2, this.x + this.width / 2, this.y + this.height);
        this.ctx.bezierCurveTo(this.x, this.y + this.height / 2, this.x, this.y, this.x + this.width / 2, this.y);
        this.fillAndAddGlow();
    }

    drawWindGustShape() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y + this.height);
        this.ctx.quadraticCurveTo(this.x + this.width / 2, this.y, this.x + this.width, this.y + this.height);
        this.ctx.quadraticCurveTo(this.x + this.width / 2, this.y + this.height / 2, this.x, this.y + this.height);
        this.fillAndAddGlow();
    }

    fillAndAddGlow() {
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
        this.y += 1;
    }
}