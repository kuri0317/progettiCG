//movimenti camera 
var keys = [];

class Movement{
    constructor(camera, lookAt, renderer, contenitore) {
        this.camera = camera;
        this.lookAt = lookAt.clone(); 

        this.renderer = renderer;
        this.contenitore = contenitore;

        const cameraPosition = new THREE.Vector3().subVectors(camera.position, lookAt);
        this.zoomDistance = cameraPosition.length();

        this.PHI = Math.atan2(cameraPosition.y, Math.sqrt(cameraPosition.x * cameraPosition.x + cameraPosition.z * cameraPosition.z));
        this.THETA = Math.atan2(cameraPosition.z, cameraPosition.x);

        // Variabili per il movimento del mouse
        this.AMORTIZATION = 0.75;
        this.drag = false;
        this.old_x = 0;
        this.old_y = 0;
        this.dX = 0;
        this.dY = 0;
        
        this.addListeners();
    }

    addListeners() {
        // Listener per tastiera
         window.addEventListener("keydown", doKeyDown, true);
         window.addEventListener("keyup", doKeyUp, true);

        // Listener per mouse
        this.renderer.domElement.addEventListener('mousedown', (e) => handleMouseDown(e, this), false);
        this.renderer.domElement.addEventListener('mouseup', (e) => handleMouseUp(e, this), false);
        this.renderer.domElement.addEventListener('mousemove', (e) => handleMouseMove(e, this), false);
        this.renderer.domElement.addEventListener('wheel', (e) => handleMouseWheel(e, this), false);

        // Listener per touchw
        this.renderer.domElement.addEventListener('touchstart', (e) => handleTouchStart(e, this), false);
        this.renderer.domElement.addEventListener('touchmove', (e) => handleTouchMove(e, this), false);
        this.renderer.domElement.addEventListener('touchend', (e) => handleTouchEnd(e, this), false);
    }
    
    update() {
        if (!this.drag) {
            this.dX *= this.AMORTIZATION;
            this.dY *= this.AMORTIZATION;

            if (Math.abs(this.dX) > 0.01 || Math.abs(this.dY) > 0.01) {
                this.THETA += this.dX;
                this.PHI += this.dY;
            }
        }
        this.updateCameraOrbit();
    }

    updateCameraOrbit() {
        let spherical = new THREE.Spherical(this.zoomDistance, this.PHI, this.THETA);
        let newCameraPosition = new THREE.Vector3().setFromSpherical(spherical).add(this.lookAt);
        this.camera.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z);
        this.camera.lookAt(this.lookAt);
    }

    zoomIn(amount) {
        this.zoomDistance = Math.max(1.0, this.zoomDistance - amount);
    this.updateCameraOrbit();
    }

    zoomOut(amount) {
        this.zoomDistance = Math.min(50.0, this.zoomDistance + amount);
        this.updateCameraOrbit();
    }

    
    moveForward(distance) {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.multiplyScalar(distance);
        this.camera.position.add(direction);
        this.lookAt.add(direction);
    }
    moveRight(distance) {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.cross(new THREE.Vector3(0, 1, 0)).normalize(); 
        direction.multiplyScalar(distance);
        this.camera.position.add(direction);
        this.lookAt.add(direction);
    }
    moveUp(distance) {
        this.camera.position.y += distance;
        this.lookAt.y += distance;
    }

    reset() {
        // Ripristina la posizione originale
        this.camera.position.set(-10, 6, -10);
        this.lookAt.set(0, 0, 0);
        this.camera.lookAt(this.lookAt);
    
        // Reimposta la distanza di zoom e gli angoli
        this.zoomDistance = this.camera.position.distanceTo(this.lookAt);
        this.PHI = Math.acos((this.camera.position.y - this.lookAt.y) / this.zoomDistance);
        this.THETA = Math.atan2(this.camera.position.z - this.lookAt.z, this.camera.position.x - this.lookAt.x);
    
        // Ripristina la rotazione de contenitore
        if (this.contenitore) {
            this.contenitore.rotation.set(0, 0, 0); 
        }

        this.updateCameraOrbit();
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

function handleMouseDown(e, movement) {
    movement.drag = true;
    movement.old_x = e.pageX;
    movement.old_y = e.pageY;
    e.preventDefault();
}

function handleMouseUp(e, movement) {
    movement.drag = false;
    e.preventDefault();
}

function handleMouseMove(e, movement) {
    if (!movement.drag || !movement.contenitore) return;

    const sensitivity = 0.005;
    let deltaX = (e.pageX - movement.old_x) * sensitivity;
    let deltaY = (e.pageY - movement.old_y) * sensitivity;

    movement.contenitore.rotation.y += deltaX; // Rotazione attorno all'asse Y per movimenti orizzontali
    movement.contenitore.rotation.x += deltaY;  // Rotazione attorno all'asse X per movimenti verticali

    movement.old_x = e.pageX;
    movement.old_y = e.pageY;

    e.preventDefault();

}

function handleMouseWheel(e, movement) {
    e.preventDefault();  // Previene scrolling pagina
    const zoomV = 0.3;

    if (e.deltaY < 0) {
        movement.zoomIn(zoomV);
    } else {
        movement.zoomOut(zoomV);
    }
}

//------mov touch

function handleTouchStart(e, movement) {

    if (e.touches.length == 1) {
        const touch = e.touches[0];
        movement.drag = true;
        movement.old_x = touch.pageX;
        movement.old_y = touch.pageY;
    }
    e.preventDefault();
}

function handleTouchMove(e, movement) {

    if (e.touches.length == 2) { //zoom  due dita
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
        const sensitivity = 0.005;

        let deltaX = (touch.pageX - movement.old_x) * sensitivity;
        let deltaY = (touch.pageY - movement.old_y) * sensitivity;

        movement.contenitore.rotation.y += deltaX;
        movement.contenitore.rotation.x += deltaY;

        movement.old_x = touch.pageX;
        movement.old_y = touch.pageY;
    }
    e.preventDefault();
}

function handleTouchEnd(movement) {
    movement.drag = false;
    movement.prevDistance = null;
}

//-----mov tastiera

function moveKeys(movement) {
    
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

export { Movement, moveKeys };