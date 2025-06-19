// Definimos la clase Pacman
class Pacman {
    // Constructor que recibe posición, tamaño y velocidad
    constructor(x, y, width, height, speed) {
        this.x = x; // Posición horizontal
        this.y = y; // Posición vertical
        this.width = width; // Ancho del personaje
        this.height = height; // Alto del personaje
        this.speed = speed; // Velocidad de movimiento
        this.direction = 4; // Dirección actual (4 = parado o sin dirección inicial)
        this.nextDirection = 4; // Dirección que se quiere tomar
        this.frameCount = 7; // Número total de cuadros de animación
        this.currentFrame = 1; // Cuadro actual de la animación
        // Cambia la animación cada 100 ms
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    // Método para procesar el movimiento
    moveProcess() {
        this.changeDirectionIfPossible(); // Intenta cambiar de dirección si se puede
        this.moveForwards(); // Avanza en la dirección actual
        if (this.checkCollisions()) { // Verifica colisiones
            this.moveBackwards(); // Si choca, retrocede
            return; // Sale del método
        }
    }

    // Método para comer puntos
    eat() {
        // Recorre el mapa
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                // Verifica si hay puntos (comestible) en la posición actual para poder comerlo.
                if (
                    (map[i][j] == 2 || map[i][j] == 4) &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    if (map[i][j] == 2) {
                        score++; // Aumenta puntaje por punto normal
                        sounds.eat.play(); // Sonido al comer punto
                    } else if (map[i][j] == 4) {
                        score += 10; // Aumenta puntaje por puntos
                        makeGhostsVulnerable(); // Vuelve vulnerables a los fantasmas
                        sounds.powerup.play(); // Sonido al comer puntos grandes.
                    }

                    map[i][j] = 3; // Marca la celda como comida
                }
            }
        }
    }

    // Método para retroceder si colisiona
    moveBackwards() {
        switch (this.direction) {
            case Direction_Right: // Si iba a la derecha
                this.x -= this.speed; // Retrocede a la izquierda
                break;
            case Direction_up: // Si iba hacia arriba
                this.y += this.speed; // Retrocede hacia abajo
                break;
            case Direction_left: // Si iba a la izquierda
                this.x += this.speed; // Retrocede hacia la derecha
                break;
            case Direction_down: // Si iba hacia abajo
                this.y -= this.speed; // Retrocede hacia arriba
                break;
        }
    }

    // Método para avanzar en la dirección actual
    moveForwards() {
        switch (this.direction) {
            case Direction_Right: // Mueve hacia la derecha
                this.x += this.speed;
                break;
            case Direction_up: // Mueve hacia arriba
                this.y -= this.speed;
                break;
            case Direction_left: // Mueve hacia la izquierda
                this.x -= this.speed;
                break;
            case Direction_down: // Mueve hacia abajo
                this.y += this.speed;
                break;
        }
    }

    // Método que verifica si hay colisiones con paredes
    checkCollisions() {
        let isCollided = false; // Asumimos que no colisiona
        // Verifica colisión en las 4 esquinas del bloque
        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) {
            isCollided = true; // Si alguna esquina choca, hay colisión
        }
        return isCollided; // Devuelve si colisionó o no
    }

    // Verifica si Pacman colisionó con un fantasma
    checkGhostCollision(ghosts) {
        for (let ghost of ghosts) {
            // Si está en la misma posición del mapa
            if (
                ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()
            ) {
                if (ghost.isVulnerable) {
                    score += 100; // Suma puntaje si fantasma es vulnerable
                    ghost.x = 9 * oneBlockSize; // Reinicia posición del fantasma
                    ghost.y = 10 * oneBlockSize;
                    ghost.isVulnerable = false; // Deja de ser vulnerable
                    sounds.eatGhost.play(); // Sonido al comer fantasma

                    return false; // No pierde vida
                } else {
                    return true; // Fantasma no vulnerable = pierde vida
                }
            }
        }
        return false; // No colisionó con ningún fantasma
    }

    // Intenta cambiar la dirección si no hay colisión
    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return; // Si ya está en la dirección deseada, no hace nada
        let tempDirection = this.direction; // Guarda la dirección actual
        this.direction = this.nextDirection; // Cambia a la nueva dirección
        this.moveForwards(); // Intenta moverse
        if (this.checkCollisions()) { // Si choca
            this.moveBackwards(); // Retrocede
            this.direction = tempDirection; // Vuelve a la dirección anterior
        } else {
            this.moveBackwards(); // Si no choca, vuelve atrás para mantener la posición
        }
    }

    // Obtiene la coordenada X en el mapa
    getMapX() {
        let mapX = parseInt(this.x / oneBlockSize); // Divide posición entre tamaño del bloque
        return mapX;
    }

    // Obtiene la coordenada Y en el mapa
    getMapY() {
        let mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    }

    // Coordenada X del lado derecho del personaje (para colisiones más precisas)
    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    // Coordenada Y del lado inferior del personaje
    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    // Cambia el cuadro de animación actual
    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1; // Cicla entre los cuadros
    }

    // Dibuja a Pacman en el canvas
    draw() {
        canvasContext.save(); // Guarda el estado actual del contexto
        // Mueve el origen al centro del personaje
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        // Rota el canvas según la dirección
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        // Vuelve a trasladar al origen original
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        // Dibuja la imagen actual del personaje
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize, // Frame horizontal en spritesheet
            0, // Frame vertical en spritesheet
            oneBlockSize, // Ancho de un cuadro
            oneBlockSize, // Alto de un cuadro
            this.x, // Posición x en el canvas
            this.y, // Posición y en el canvas
            this.width, // Ancho a dibujar
            this.height // Alto a dibujar
        );
        canvasContext.restore(); // Restaura el contexto
    }
}
