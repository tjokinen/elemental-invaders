export default class Player {
    constructor(x, y, width, height, canvas, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.speed = 10; // Adjust this value to control the player's speed
        this.canvas = canvas;
        this.ctx = ctx;
    }

    draw() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'left') {
            this.velocityX = -this.speed;
        } else if (direction === 'right') {
            this.velocityX = this.speed;
        } else {
            this.velocityX = 0;
        }
    }

    update() {
        this.x += this.velocityX;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.canvas.width) {
            this.x = this.canvas.width - this.width;
        }
    }
    
}

window.Player = Player;
