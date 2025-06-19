// Función para iniciar el juego
function startGame() {
    // Oculta el menú principal
    document.getElementById('mainMenu').style.display = 'none';
    // Muestra el contenedor principal del juego
    document.getElementById('gameContainer').style.display = 'flex';
    // Oculta la pantalla de Game Over
    document.getElementById('gameOverScreen').style.display = 'none';
    // Oculta la pantalla de victoria
    document.getElementById('victoryScreen').style.display = 'none';

    // Archivos JavaScript necesarios para el juego
    const scripts = ['js/ghost.js', 'js/pacman.js', 'js/game.js'];
    // Carga dinámica de cada archivo
    scripts.forEach(src => {
        const script = document.createElement('script'); // Crea una etiqueta <script>
        script.src = src; // Asigna el archivo fuente
        document.body.appendChild(script); // Lo agrega al body para que se ejecute
    });
}

// Función para volver al menú principal
function returnToMainMenu() {
    // Muestra el menú principal
    document.getElementById('mainMenu').style.display = 'block';
    // Oculta el contenedor del juego
    document.getElementById('gameContainer').style.display = 'none';
    // Oculta la pantalla de Game Over
    document.getElementById('gameOverScreen').style.display = 'none';
    // Oculta la pantalla de victoria
    document.getElementById('victoryScreen').style.display = 'none';
    location.reload(); // Recarga la página para reiniciar el estado del juego
}

// Función para reiniciar el juego completamente
function restartGame() {
    returnToMainMenu(); // Vuelve al menú principal
    startGame(); // Inicia de nuevo el juego
}

// Crea puntos animados en el fondo del menú principal
const dotCount = 40; // Número de puntos a generar
const background = document.getElementById('backgroundAnimation'); // Contenedor del fondo

// Genera los puntos de forma aleatoria
for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div'); // Crea un nuevo div
    dot.className = 'dot'; // Le asigna la clase "dot" para estilos
    dot.style.left = `${Math.random() * 100}%`; // Posición horizontal aleatoria
    dot.style.animationDelay = `${Math.random() * 5}s`; // Retraso de animación aleatorio
    background.appendChild(dot); // Lo agrega al contenedor del fondo
}

// Función global para mostrar la pantalla de Game Over
window.showGameOverUI = function() {
    // Oculta el juego
    document.getElementById('gameContainer').style.display = 'none';
    // Muestra la pantalla de Game Over
    document.getElementById('gameOverScreen').style.display = 'flex';
    // Muestra el puntaje final
    document.getElementById('finalScoreGameOver').textContent = score;
}

// Función global para mostrar la pantalla de victoria
window.showVictoryUI = function() {
    // Oculta el juego
    document.getElementById('gameContainer').style.display = 'none';
    // Muestra la pantalla de victoria
    document.getElementById('victoryScreen').style.display = 'flex';
    // Muestra el puntaje final
    document.getElementById('finalScoreVictory').textContent = score;
}
