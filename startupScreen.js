export default class StartupScreen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    drawTitle() {
        let grd = this.ctx.createLinearGradient(this.canvas.width * 0.1, 0, this.canvas.width * 0.9, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "white");
        this.ctx.fillStyle = grd;
        this.ctx.font = '24px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Elemental Invaders', this.canvas.width / 2, this.canvas.height * 0.3);
    }

    drawStartButton() {
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (this.canvas.width - buttonWidth) / 2;
        const buttonY = this.canvas.height * 0.5;

        // Draw button background
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Draw button text
        this.ctx.fillStyle = 'black';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Start Game', this.canvas.width / 2, buttonY + buttonHeight * 0.65);
    }

    drawInstructions() {
        const instructions = [
            'Arrow keys: Move',
            'Spacebar: Shoot',
            'Q: Change projectile type',
            'Defeat elemental creatures',
            'Fire against wind',
            'Water against fire',
            'Earth against water',
            'Wind against earth',
            'Collect power-ups for bonuses'
        ];

        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';

        instructions.forEach((line, index) => {
            this.ctx.fillText(line, this.canvas.width / 2, this.canvas.height * 0.65 + index * 20);
        });
    }

    draw() {
        this.drawTitle();
        this.drawStartButton();
        this.drawInstructions();
    }
}
