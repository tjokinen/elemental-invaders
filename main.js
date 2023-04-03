import Player from './player.js';
import Creature from './creature.js';
import Projectile from './projectile.js';
import { collision } from './utilities.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player = new Player(canvas.width / 2 - 25, canvas.height - 60, 50, 10, canvas, ctx);
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

function switchProjectileType() {
    const types = ['fire', 'water', 'earth', 'air'];
    const currentIndex = types.indexOf(activeProjectileType);
    activeProjectileType = types[(currentIndex + 1) % types.length];
}

const projectiles = [];
const creatures = [];

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


function spawnCreatures() {
    const creatureTypes = ['fire', 'water', 'earth', 'air'];
    const type = creatureTypes[Math.floor(Math.random() * creatureTypes.length)];
    const x = Math.random() * (canvas.width - 30);
    const creature = new Creature(x, 0, 30, 30, type, ctx);
    creatures.push(creature);
}

function shootProjectile(type) {
    const projectile = new Projectile(player.x + player.width / 2 - 5, player.y, 10, 20, type, ctx);
    projectiles.push(projectile);
}

function drawStatus() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Health: ${player.health}`, 10, 30);
    ctx.fillText(`Score:  ${score}`, 10, 60);
}

function endGame() {
    // Clear the game loop
    cancelAnimationFrame(animationId);

    // Set the gameOver flag
    gameOver = true;

    // Display the "Game Over" text
    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
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
            console.log("remove creature from game")
            creatures.splice(index, 1);

            // Reduce player health
            player.loseHealth(endGame);
        }
    });

    player.update();
    player.draw();
    drawStatus();

    animationId = requestAnimationFrame(gameLoop);
}

gameLoop();

// Spawn creatures periodically
setInterval(spawnCreatures, 2000);

// Add touch event listener for shooting projectiles
canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    shootProjectile(activeProjectileType); // Replace 'fire' with the active projectile type
});

// Add keyboard event listener for shooting projectiles
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
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

//Play again button click listener
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if the click is within the "Play again" button area
    if (gameOver && x >= canvas.width / 2 - 75 && x <= canvas.width / 2 + 75 && y >= canvas.height / 2 + 50 && y <= canvas.height / 2 + 100) {
        // Reset the game variables
        player.resetHealth();
        score = 0;
        gameOver = false;
        creatures.length = 0;
        projectiles.length = 0;

        // Restart the game loop
        gameLoop();
    }
});


// Touch event listeners for mobile devices
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