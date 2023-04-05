export default class Player {
    constructor(x, y, width, height, canvas, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.baseSpeed = 10;
        this.speed = 5; // Adjust this value to control the player's speed
        this.canvas = canvas;
        this.ctx = ctx;
        this.health = 3;
        this.autoShoot = false;
        this.autoShootDuration = 5000; // Duration of the automatic shooting in milliseconds
        this.autoShootInterval = null;
        this.speedBoostInterval = null;
        this.color = 'white';
        this.powerUpDuration = 0;
        this.autoShootSpeed = 50; // Adjust this value to control the shooting speed
        this.currentPowerUpIndex = 0;
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

        this.powerUpIndex = ++this.currentPowerUpIndex;

        if (this.powerUpDuration > 0) {
            this.autoShoot = false;
            this.powerUpDuration = 0;
            clearInterval(this.autoShootInterval);
            clearInterval(this.speedBoostInterval);
        }

        this.powerUpDuration = 100;
        this.autoShoot = true;

        this.autoShootInterval = setInterval(() => {
            const activeProjectileType = getActiveProjectileType();
            shootProjectile(activeProjectileType);
            this.powerUpDuration -= this.autoShootSpeed * 100 / this.autoShootDuration; // Reduce the power-up duration
        }, this.autoShootSpeed);

        setTimeout(() => {
            if (this.powerUpIndex === this.currentPowerUpIndex) {
                this.autoShoot = false;
                this.powerUpDuration = 0;
                clearInterval(this.autoShootInterval);
            }
        }, this.autoShootDuration);
    }

    applySpeedBoostPowerUp() {

        this.powerUpIndex = ++this.currentPowerUpIndex;

        if (this.powerUpDuration > 0) {
            this.autoShoot = false;
            this.powerUpDuration = 0;
            clearInterval(this.autoShootInterval);
            clearInterval(this.speedBoostInterval);
        }

        this.powerUpDuration = 100;
        this.speed = this.baseSpeed * 2;

        this.speedBoostInterval = setInterval(() => {
            this.powerUpDuration -= 1;
        }, 50)

        setTimeout(() => {
            if (this.powerUpIndex === this.currentPowerUpIndex) {
                this.speed = this.baseSpeed;
                this.powerUpDuration = 0;
                clearInterval(this.speedBoostInterval);
            }
        }, 5000); // Duration of the speed boost (in milliseconds)
    }

    getPowerUpDuration() {
        return this.powerUpDuration;
    }
}

window.Player = Player;
