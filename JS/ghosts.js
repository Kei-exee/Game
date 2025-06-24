class Ghost { //se define una clase llamada ghost que se refiere a los fantasmas // poo es una forma para crear objetos con propiedades y comportamientos específicos atraves de clases
    constructor( // función especial de clase se ejecuta cuando se crea una nueva instancia u objeto de la clase, se inicializa con valores específicos
        x, //posición horizontal  del fantasma en la pantalla o canvas
        y, //posición vertical del fantasma en la pantalla o canvas
        width, //ancho del fantasma
        height, //alto del fantasma
        speed,  //velocidad con la que mueve el fantasma
        imageX, //coordenadas horizontal dentro de una imagen sprite
        imageY, //coordenada vertical del prite dentro de la imagen
        imageWidth, //ancho de la sección del sprite a dibujar
        imageHeight,//alto de la sección del sprite a dibujar
        range //rango de movimiento permitido para el fantasma
        
    ) { // Guarda esos valores como propiedades del objeto
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = Direction_Right; //Inicializa la dirección en la que se moverá el fantasma (por defecto: derecha).
        //Define la parte de la imagen (sprite) que se usará para dibujar al fantasma.
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.isVulnerable = false;
        this.randomTargetIndex = parseInt(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }

    isInRange() { //determina si pacman está dentro del rango de detección
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.range
        ) {
            return true;
        }
        return false;
    }

    changeRandomDirection() { //Cambia el objetivo cada 10 segundos (mediante setInterval)
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    moveProcess() { //controla el movimiento principal del fantasma
    //Decide si perseguir a Pac-Man (si está en rango) o moverse aleatoriamente
    //Cambia de dirección si es posible
    //Maneja colisiones con paredes
        if (this.isInRange()) {
            this.target = pacman; //persigue a pacman si está cerca
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex]; //objetivo aleatorio
        } //intenta cambiar de dirección si es posible
        this.changeDirectionIfPossible();
        this.moveForwards(); //se mueve hacia adelante
        if (this.checkCollisions()) { //si hay colisión, retrocede
            this.moveBackwards();
            return;
        }
    }
    moveBackwards() {//retrocede cuando hay colisión
        switch (this.direction) {
            case 4: // derecha
                this.x -= this.speed;
                break;
            case 3: // arriba
                this.y += this.speed;
                break;
            case 2: // izquierda
                this.x += this.speed;
                break;
            case 1: // abajo
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {//mueve al fantasma en la dirección actual
        switch (this.direction) {
            case 4: // derecha
                this.x += this.speed;
                break;
            case 3: // arriba
                this.y -= this.speed;
                break;
            case 2: // izquierda
                this.x -= this.speed;
                break;
            case 1: // abajo
                this.y += this.speed;
                break;
        }
    }

    checkCollisions() { //detecta colisiones con paredes
        let isCollided = false;
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
            isCollided = true;
        }
        return isCollided;
    }

    changeDirectionIfPossible() { //toma de decisiones, Este método es donde los fantasmas deciden su ruta usando un algoritmo de búsqueda de caminos (BFS simplificado):
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection( //calcula nueva dirección hacia el objetivo
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );

        //si no encontró camino, mantiene la dirección actual
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (
            this.getMapY() != this.getMapYRightSide() &&
            (this.direction == Direction_left ||
                this.direction == Direction_Right)
        ) {
            this.direction = Direction_up;
        }
        if (
            this.getMapX() != this.getMapXRightSide() &&
            this.direction == Direction_up
        ) {
            this.direction = Direction_left;
        }
        //intenta moverse en la nueva dirección
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
        console.log(this.direction);
    }

    calculateNewDirection(map, destX, destY) { //calcula la mejor dirección hacia el objeto usando un algoritmo BFS
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp); //Ayuda en el cálculo de rutas evaluando celdas adyacentes
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return 1; // direction
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(Direction_left);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(Direction_Right);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(Direction_up);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(Direction_down);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    getMapX() {
        let mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    }

    getMapY() {
        let mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    }

    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    changeAnimation() { //cambia los frames de animación
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() { //dibuja el fantasma en el canvas usando sprites
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
        /*
        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2,
            this.range * oneBlockSize,
            0,
            2 * Math.PI
        );*/
        canvasContext.stroke();
    }
}

let updateGhosts = () => { //Actualiza el estado de todos los fantasmas
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};

let drawGhosts = () => { //dibuja todos los fantasmas en pantalla
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};
