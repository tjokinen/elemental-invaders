import Player from './player.js';
import Creature from './creature.js';
import Projectile from './projectile.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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


const player = new Player(canvas.width / 2 - 25, canvas.height - 60, 50, 10, canvas, ctx);

let score = 0;
const scoreElement = document.createElement('div');
scoreElement.style.color = 'white';
scoreElement.style.position = 'fixed';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.fontSize = '24px';
document.body.appendChild(scoreElement);
scoreElement.textContent = `Score: ${score}`;

function collision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                scoreElement.textContent = `Score: ${score}`;
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
    });

    player.update();
    player.draw();

    requestAnimationFrame(gameLoop);
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
