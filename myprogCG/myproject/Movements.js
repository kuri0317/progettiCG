//movimenti camera e cubo
var keys = []; //traccia i tasti premuti dall'utente per gestire movimenti camera e modelli

class Movement{
    constructor(pos, lookAt, up ){
        this.position = pos
        this.forward = m4.normalize(m4.subtractVectors(lookAt, pos)); //vettore di direzione normalizzato da pos verso lookAt
        this.right = m4.normalize(m4.cross(this.forward, up));
        this.up = m4.normalize(m4.cross(this.right, this.forward));
        
        // Variabili per il movimento del mouse
        this.AMORTIZATION = 0.75;
        this.drag = false;
        this.old_x = 0;
        this.old_y = 0;
        this.dX = 0;
        this.dY = 0;
        this.THETA = 0;
        this.PHI = 0;

        this.zoomDistance = m4.length(m4.subtractVectors(pos, lookAt));
    }
    
    update() {
        if (!this.drag) {
            // Ammortizza il movimento
            this.dX *= this.AMORTIZATION;
            this.dY *= this.AMORTIZATION;

            this.THETA += this.dX; //aggiornamento angolazione camera
            this.PHI += this.dY;
        }
    }
    getRotationMatrix() {
        // matrice di rotazione con `THETA` e `PHI`
        let rotationMatrix = m4.identity();
    
        rotationMatrix = m4.yRotate(rotationMatrix, this.THETA);
        rotationMatrix = m4.xRotate(rotationMatrix, this.PHI);
    
        return rotationMatrix;
    }

    getViewMatrix(){
        const look = m4.addVectors(this.position, this.forward);
        const viewMatrix = m4.lookAt(this.position, look, this.up);
        return m4.inverse(viewMatrix); //viewMatrix
    }

    zoomIn(amount) {
        this.zoomDistance = Math.max(0.50, this.zoomDistance - amount);  
        this.position = m4.addVectors(this.position, m4.scale(this.forward, amount));
    }

    zoomOut(amount) {
        this.zoomDistance = Math.min(50.0, this.zoomDistance + amount);  
        this.position = m4.addVectors(this.position, m4.scale(this.forward, -amount));
    }
    //movimenti pe rtasti
    moveForward(distance) {
        this.position[0] += this.forward[0] * distance;
        this.position[1] += this.forward[1] * distance;
        this.position[2] += this.forward[2] * distance;
    }

    moveRight(distance) {
        this.position[0] += this.right[0] * distance;
        this.position[1] += this.right[1] * distance;
        this.position[2] += this.right[2] * distance;
    }
    moveUp(distance) {
        this.position[0] += this.up[0] * distance;
        this.position[1] += this.up[1] * distance;
        this.position[2] += this.up[2] * distance;
    }

    rotateUp(angle) {

        const rotation = m4.axisRotation(this.right, angle);

        this.forward = m4.transformPoint(rotation, this.forward);
        this.up = m4.transformPoint(rotation, this.up);
        this.forward = m4.normalize(this.forward);
        this.up = m4.normalize(this.up);
    }

    rotateLeft(angle) {

        const rotation = m4.axisRotation(this.up, angle);
        
        this.forward = m4.transformPoint(rotation, this.forward);
        this.right = m4.transformPoint(rotation, this.right);
        this.forward = m4.normalize(this.forward);
        this.right = m4.normalize(this.right);
    }

    reset() {
        this.position = [-10, 6, -10]; 
        
        this.forward = m4.normalize(m4.subtractVectors([0, 0, 0], this.position)); 
        this.right = m4.normalize(m4.cross(this.forward, [0, 1, 0]));
        this.up = [0, 1, 0];

        this.THETA = 0;
        this.PHI = 0;

        this.zoomDistance = m4.length(m4.subtractVectors(this.position, [0, 0, 0]));
    }

    updatePosition() {
        this.position = m4.addVectors([0, 0, 0], m4.scale(this.forward, -this.zoomDistance));
    }

    getPosition() {
        return this.position;
    }

}
//---------mov tastier
function doKeyDown(e) {
    keys[e.key] = true;
}

function doKeyUp(e) {
    keys[e.key] = false;
}

//----------movimenti mouse

function handleMouseDown(e) {
    if (e.target.closest("#gui-container") && e.target.tagName !== 'INPUT') {
        return;
    }
    movement.drag = true;  
    movement.old_x = e.pageX;
    movement.old_y = e.pageY;
    e.preventDefault();  
}

function handleMouseUp(e) {
    movement.drag = false; 
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!movement.drag ) return;

    if (!e.target.closest("#gui-container") || e.target.tagName === 'CANVAS') {
        movement.dX = -(e.pageX - movement.old_x) * 2 * Math.PI / canvas.width;
        movement.dY = -(e.pageY - movement.old_y) * 2 * Math.PI / canvas.height;
        
        movement.THETA += movement.dX * 0.5; 
        movement.PHI += movement.dY * 0.5;

        movement.old_x = e.pageX; //aggiornamento movimenti
        movement.old_y = e.pageY;

        e.preventDefault();
    }
}

function handleMouseWheel(e) {
    e.preventDefault();  // scrolling pagina
    const zoomV = 0.3;  

    if (e.deltaY < 0) {
        movement.zoomIn(zoomV);
    } else {
        movement.zoomOut(zoomV);
    }
}

//------mov touch

function handleTouchStart(e) {

    if (e.touches.length == 1) {
        const touch = e.touches[0];
        movement.drag = true;
        movement.old_x = touch.pageX; 
        movement.old_y = touch.pageY;
    }
    e.preventDefault();
}

function handleTouchMove(e) {

    if (e.touches.length == 2) { // zoom due dita
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const currentDistance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
        );

        if (movement.prevDistance) {
            const zoomAmount = (currentDistance - movement.prevDistance) * 0.01;
            if (zoomAmount > 0) {
                movement.zoomIn(zoomAmount);
            } else {
                movement.zoomOut(-zoomAmount);
            }
        }

        movement.prevDistance = currentDistance;
    } else if (e.touches.length == 1 && movement.drag) {
        const touch = e.touches[0];

        movement.dX = -(touch.pageX - movement.old_x) * 2 * Math.PI / canvas.width;
        movement.dY = -(touch.pageY - movement.old_y) * 2 * Math.PI / canvas.height;

        movement.THETA += movement.dX * 0.5;
        movement.PHI += movement.dY * 0.5;

        movement.old_x = touch.pageX;
        movement.old_y = touch.pageY;
    }
    e.preventDefault();
}

function handleTouchEnd() {
    movement.drag = false;
    movement.prevDistance = null;
}

//-----mov tastiera

function moveKeys() {
    
    const v = 0.3;  
    if (keys["w"] || keys["ArrowUp"]) {
        movement.moveForward(v);
    }
    if (keys["s"] || keys["ArrowDown"]) {
        movement.moveForward(-v);
    }
    if (keys["a"] || keys["ArrowLeft"]) {
        movement.moveRight(-v);
    }
    if (keys["d"] || keys["ArrowRight"]) {
        movement.moveRight(v);
    }
    if (keys["q"]) {
        movement.moveUp(v);
    }
    if (keys["e"]) {
        movement.moveUp(-v);
    }
    if (keys["r"]) {
        movement.reset();
    }

}

function move(){
    // Keyboard listeners
    window.addEventListener("keydown", doKeyDown, true);
    window.addEventListener("keyup", doKeyUp, true);

    // Mouse listeners
    canvas.addEventListener('mousedown', handleMouseDown, false);
    canvas.addEventListener('mouseup', handleMouseUp, false);
    canvas.addEventListener('mousemove', handleMouseMove, false);
    canvas.addEventListener('mouseout', handleMouseUp, false);
    canvas.addEventListener('wheel', handleMouseWheel, false);

    // touch listener
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, false);
    canvas.addEventListener('touchend', handleTouchEnd, false);
    canvas.addEventListener('mouseout', handleTouchEnd, false);

}