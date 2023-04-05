import Player from './player.js';
import Creature from './creature.js';
import Projectile from './projectile.js';
import { collision } from './utilities.js';
import PowerUp from './powerup.js';
import { drawPowerUpDurationBar } from './ui.js';
import StartupScreen from './startupScreen.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    if (window.innerHeight >= window.innerWidth * 0.75) {
        if (window.innerWidth >= 820) {
            canvas.width = 800;
        } else {
            canvas.width = window.innerWidth - 20;
        }
        canvas.height = canvas.width * 0.75;
    } else {
        if (window.innerHeight >= 620) {
            canvas.height = 600;
        } else {
            canvas.height = window.innerHeight - 20;
        }
        canvas.width = canvas.height / 0.75;
    }
}

setCanvasSize();

const player = new Player(canvas.width / 2 - 25, canvas.height * 0.9, canvas.width * 0.0625, canvas.width * 0.0125, canvas, ctx, shootProjectile);
let animationId;
let gameOver = false;
let score = 0;
const weaknesses = {
    fire: 'water',
    water: 'earth',
    earth: 'air',
    air: 'fire',
};
let activeProjectileType = 'fire';

const projectiles = [];
const creatures = [];
const powerUps = [];
let powerUpMessage = '';
let powerUpMessageTimeout;

const startupScreen = new StartupScreen(canvas, ctx);

// Flag to check if the game has started
let gameStarted = false;


function switchProjectileType() {
    const types = ['fire', 'water', 'earth', 'air'];
    const currentIndex = types.indexOf(activeProjectileType);
    activeProjectileType = types[(currentIndex + 1) % types.length];
}


function showPowerUpMessage(message) {
    clearTimeout(powerUpMessageTimeout); // Clear any previous timeout
    powerUpMessage = message;
    powerUpMessageTimeout = setTimeout(() => {
        powerUpMessage = ''; // Clear the message after the timeout
    }, 2000); // Adjust this value to control how long the message is displayed
}

function drawPowerUpMessage() {
    if (powerUpMessage) {
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(powerUpMessage, canvas.width / 2, 100);
    }
}


function drawPlayAgainButton(x, y, width, height) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Play again', x + width / 2, y + height * 0.7);
}

function drawChangeProjectileButton() {
    const buttonWidth = 150;
    const buttonHeight = 40;
    const buttonX = 10;
    const buttonY = canvas.height - buttonHeight - 10;

    switch (activeProjectileType) {
        case 'fire':
            ctx.fillStyle = 'red';
            break;
        case 'water':
            ctx.fillStyle = 'blue';
            break;
        case 'earth':
            ctx.fillStyle = 'green';
            break;
        case 'air':
            ctx.fillStyle = 'white';
            break;
        default:
            ctx.fillStyle = 'red';
    }
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Change Type', buttonX + buttonWidth / 2, buttonY + buttonHeight * 0.65);
}



function spawnCreatures() {
    const creatureTypes = ['fire', 'water', 'earth', 'air'];
    const type = creatureTypes[Math.floor(Math.random() * creatureTypes.length)];
    const x = Math.random() * (canvas.width - 30);
    const creature = new Creature(x, 0, 30, 30, type, ctx);
    creatures.push(creature);
}

function spawnPowerUp() {
    const powerUpTypes = ['speedBoost', 'autoShoot'];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    const x = Math.random() * (canvas.width - 30);
    const powerUp = new PowerUp(x, 0, 30, 30, type, ctx);
    powerUps.push(powerUp);
}

function shootProjectile(type) {
    const projectile = new Projectile(player.x + player.width / 2 - 5, player.y, 10, 20, type, ctx);
    projectiles.push(projectile);
}

function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y + size / 4);
    ctx.arc(x + size / 4, y + size / 4, size / 4, 0, Math.PI, true);
    ctx.lineTo(x + size / 2, y + size * 0.75);
    ctx.lineTo(x + size, y + size / 4);
    ctx.arc(x + size * 0.75, y + size / 4, size / 4, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
}

function drawStatus() {
    // Draw hearts for health
    for (let i = 0; i < player.health; i++) {
        drawHeart(10 + i * 30, 10, 25);
    }

    // Draw the score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score:  ${score}`, 10, 60);
}


function endGame() {
    // Clear the game loop
    cancelAnimationFrame(animationId);

    // Set the gameOver flag
    gameOver = true;

    // Display the "Game Over" text
    ctx.fillStyle = 'red';
    ctx.font = '48px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

    // Draw the "Play again" button
    drawPlayAgainButton(canvas.width / 2 - 75, canvas.height / 2 + 50, 150, 50);
}



function gameLoop() {

    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        return;
    }

    projectiles.forEach((projectile, pIndex) => {
        projectile.update();
        projectile.draw();

        creatures.forEach((creature, cIndex) => {
            if (collision(projectile, creature) && projectile.type === weaknesses[creature.type]) {
                // Remove collided projectile and creature
                projectiles.splice(pIndex, 1);
                creatures.splice(cIndex, 1);

                // Increase score
                score += 10;
            }
        });

        // Remove off-screen projectiles
        if (projectile.y < 0) {
            projectiles.splice(pIndex, 1);
        }
    });

    creatures.forEach((creature, index) => {
        creature.update();
        creature.draw();

        // Remove off-screen creatures
        if (creature.y > canvas.height) {
            creatures.splice(index, 1);
        }


        // Check if a creature has reached the bottom of the canvas or collided with the player
        if (creature.y + creature.height >= canvas.height || collision(creature, player)) {
            // Remove the creature from the game
            creatures.splice(index, 1);

            // Reduce player health
            player.loseHealth(endGame);
        }
    });

    powerUps.forEach((powerUp, index) => {
        powerUp.update();
        powerUp.draw();

        // Check for collision with player
        if (collision(powerUp, player)) {
            powerUps.splice(index, 1);

            switch (powerUp.type) {
                case 'speedBoost':
                    player.applySpeedBoostPowerUp();
                    showPowerUpMessage('Speed Boost!'); // Display the message
                    break;
                case 'autoShoot':
                    player.applyAutoShootPowerUp(shootProjectile, () => activeProjectileType); // Pass the shootProjectile function as an argument
                    showPowerUpMessage('Auto Shoot!'); // Display the message
                    break;
            }

        }
        // Remove off-screen power-ups
        else if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        }
    });

    player.update();
    player.draw();
    drawPowerUpDurationBar(ctx, canvas, player.getPowerUpDuration());
    drawStatus();
    drawPowerUpMessage(); // Draw the power-up message on the canvas
    drawChangeProjectileButton();

    animationId = requestAnimationFrame(gameLoop);
}

function startGame() {

    if (gameStarted) {
        return;
    }

    gameStarted = true;

    // Spawn creatures periodically
    setInterval(spawnCreatures, 2000);

    // Spawn power-ups every 10 seconds
    setInterval(spawnPowerUp, 10000);

    // Start the game loop
    gameLoop();
}

canvas.addEventListener('click', handleCanvasClick);
function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    processClickOrTouch(x, y);
}

function processClickOrTouch(x, y) {
    // Play again button
    if (gameOver && x >= canvas.width / 2 - 75 && x <= canvas.width / 2 + 75 && y >= canvas.height / 2 + 50 && y <= canvas.height / 2 + 100) {
        // Reset the game variables
        player.resetHealth();
        score = 0;
        gameOver = false;
        creatures.length = 0;
        projectiles.length = 0;
        powerUps.length = 0;

        // Restart the game loop
        gameLoop();
    }

    // Start game button
    if (!gameStarted) {
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (canvas.width - buttonWidth) / 2;
        const buttonY = canvas.height * 0.5;

        if (
            x >= buttonX && x <= buttonX + buttonWidth &&
            y >= buttonY && y <= buttonY + buttonHeight
        ) {
            startGame();
        }
    }

    // Shoot projectile when the game is running
    if (gameStarted && !gameOver) {
        shootProjectile(activeProjectileType);

        // Change projectile button
        const buttonWidth = 150;
        const buttonHeight = 40;
        const buttonX = 10;
        const buttonY = canvas.height - buttonHeight - 10;

        if (
            x >= buttonX && x <= buttonX + buttonWidth &&
            y >= buttonY && y <= buttonY + buttonHeight
        ) {
            switchProjectileType();
        }
    }
}

// Add keyboard event listener for shooting projectiles
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (e.repeat) { return }
        e.preventDefault();
        shootProjectile(activeProjectileType); // Replace 'fire' with the active projectile type
    }
});

//keydown event listener to switch the projectile type
document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyQ') {
        e.preventDefault();
        switchProjectileType();
    }
});

// Keyboard event listeners for desktop devices
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        player.move('left');
    } else if (e.code === 'ArrowRight') {
        player.move('right');
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.move('stop');
    }
});


// Touch event listeners for mobile devices

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    processClickOrTouch(x, y);
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTouchMove(e.touches[0].clientX);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTouchMove(e.touches[0].clientX);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    player.move('stop');
});

function handleTouchMove(touchX) {
    const playerCenterX = player.x + player.width / 2;
    if (touchX < playerCenterX && player.x > 0) {
        player.move('left');
    } else if (touchX > playerCenterX && player.x < canvas.width - player.width) {
        player.move('right');
    }
}

window.addEventListener('resize', () => {
    setCanvasSize();
    player.setPositionAndSize(canvas.width / 2 - 25, canvas.height * 0.9, canvas.width * 0.0625, canvas.width * 0.0125);
    if (!gameStarted && !gameOver) {
        startupScreen.draw();
    }
});


// Draw the startup screen
startupScreen.draw();