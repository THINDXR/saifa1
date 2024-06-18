const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const character1 = new Image();
const character2 = new Image();
const heart = new Image();

character1.src = 'c4.png'; // Replace with your first custom character image
character2.src = 'c3.png'; // Replace with your second custom character image
heart.src = 'shi2.png'; // Replace with your custom heart image

let selectedCharacter = character1;

// Some variables
let characterWidth = 70; // Updated width of the character
let characterHeight = 120; // Updated height of the character
let heartWidth = 40; // Updated width of the heart
let heartHeight = 40; // Updated height of the heart
let characterX = canvas.width / 2 - characterWidth / 2;
let characterY = canvas.height - characterHeight - 10;
let score = 0;
let hearts = [];
let timeLeft = 15; // Time limit in seconds
let gameOver = false;
let isPaused = false;
let gameStarted = false;

// Key controls
document.addEventListener('keydown', moveCharacter);
canvas.addEventListener('touchstart', moveCharacterTouch);

// Character selection
const characterElements = document.querySelectorAll('.character');
characterElements.forEach(characterElement => {
    characterElement.addEventListener('click', () => {
        characterElements.forEach(el => el.classList.remove('selected'));
        characterElement.classList.add('selected');
        selectedCharacter = characterElement.id === 'character1' ? character1 : character2;
        document.getElementById('confirmBtn').style.display = 'block';
    });
});

// Confirm button
document.getElementById('confirmBtn').addEventListener('click', () => {
    document.getElementById('confirmBtn').style.display = 'none';
    document.getElementById('playBtn').style.display = 'block';
});

// Play button
document.getElementById('playBtn').addEventListener('click', startCountdown);

function startCountdown() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('countdown').style.display = 'block';
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        if (countdown === 0) {
            clearInterval(countdownInterval);
            startGame();
            document.getElementById('gameCanvas').style.display = 'block';
            document.getElementById('returnBtn').style.display = 'block';
            document.getElementById('pauseBtn').style.display = 'block';
            document.getElementById('countdown').style.display = 'none';
        } else {
            document.getElementById('countdown').textContent = countdown.toString();
            countdown--;
        }
    }, 1000);
}

function startGame() {
    gameStarted = true;
    draw();
    setInterval(updateTimer, 1000);
}

function moveCharacter(e) {
    if (e.key === 'ArrowLeft' && characterX > 0) {
        characterX -= 15;
    } else if (e.key === 'ArrowRight' && characterX < canvas.width - characterWidth) {
        characterX += 15;
    }
}

function moveCharacterTouch(e) {
    const touchX = e.touches[0].clientX - canvas.offsetLeft;
    if (touchX < characterX) {
        characterX -= 15;
    } else if (touchX > characterX + characterWidth) {
        characterX += 15;
    }
}

// Pause/Play button
document.getElementById('pauseBtn').addEventListener('click', togglePause);

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseBtn').textContent = isPaused ? 'Play' : 'Pause';
}

// Generate hearts
function generateHearts() {
    if (Math.random() < 0.05) {
        hearts.push({
            x: Math.random() * (canvas.width - heartWidth),
            y: 0
        });
    }
}

// Timer countdown
function updateTimer() {
    if (!isPaused && gameStarted && timeLeft > 0) {
        timeLeft--;
        document.getElementById('timer').textContent = 'Time: ' + timeLeft;
    } else if (timeLeft === 0) {
        gameOver = true;
        alert('Time\'s up! Your final score is: ' + score);
        resetGame();
    }
}

// Draw everything
function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(selectedCharacter, characterX, characterY, characterWidth, characterHeight);

    for (let i = 0; i < hearts.length; i++) {
        if (!isPaused) {
            hearts[i].y += 2;
        }
        ctx.drawImage(heart, hearts[i].x, hearts[i].y, heartWidth, heartHeight);

        // Check for collision
        if (hearts[i].x < characterX + characterWidth && hearts[i].x + heartWidth > characterX &&
            hearts[i].y < characterY + characterHeight && hearts[i].y + heartHeight > characterY) {
            hearts.splice(i, 1);
            score++;
            document.getElementById('score').textContent = 'Score: ' + score;
        } else if (hearts[i].y > canvas.height) {
            hearts.splice(i, 1);
        }
    }

    if (!isPaused) {
        generateHearts();
    }
    requestAnimationFrame(draw);
}

function resetGame() {
    hearts = [];
    score = 0;
    timeLeft = 15;
    gameOver = false;
    isPaused = false;
    gameStarted = false;
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('timer').textContent = 'Time: ' + timeLeft;
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('returnBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
}

// Return button
document.getElementById('returnBtn').addEventListener('click', () => {
    resetGame();
});
