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
        this.health = 3;
        this.autoShoot = false;
        this.autoShootDuration = 5000; // Duration of the automatic shooting in milliseconds
        this.autoShootInterval = null;
        this.color = 'white';
    }

    draw() {
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

    loseHealth(onZeroHealth) {
        this.health -= 1;
        if (this.health <= 0) {
            this.health = 0;
            onZeroHealth();
        }
    }

    resetHealth() {
        this.health = 3;
    }

    applyAutoShootPowerUp(shootProjectile, getActiveProjectileType) {

        if (this.autoShoot) {
            return;
        }

        this.autoShoot = true;

        this.autoShootInterval = setInterval(() => {
            const activeProjectileType = getActiveProjectileType();
            shootProjectile(activeProjectileType);
        }, 50); // Adjust this value to control the shooting speed

        setTimeout(() => {
            this.autoShoot = false;
            clearInterval(this.autoShootInterval);
        }, this.autoShootDuration);
    }

    applySpeedBoostPowerUp() {
        this.speed *= 2;
        setTimeout(() => {
            this.speed /= 2;
        }, 5000); // Duration of the speed boost (in milliseconds)
    }
}

window.Player = Player;
