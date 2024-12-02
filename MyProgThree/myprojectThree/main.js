//main
import { CreaModello } from './creaModello.js';
import { Movement, moveKeys  } from './Movements.js';
import { GUI } from './panelgui.js';

let scene, camera, renderer;
let models = [];

var movement;
let contenitore= null;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 800 / 800, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('mycanvas') });
    const canvas = document.getElementById('mycanvas');
    const width = canvas.clientWidth;
    renderer.setSize(width, width);  
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera.position.set(-10, 6, -10);
    camera.lookAt(0, 0, 0);

    contenitore= new THREE.Group();
    scene.add(contenitore);

    movement = new Movement(camera, new THREE.Vector3(0, 0, 0), renderer, contenitore);
    movement.reset();

    // Luce ambientale
    const ambientLight = new THREE.AmbientLight(0x404040, 2); 
    scene.add(ambientLight);
    // Luce puntiforme blu
    const bluePointLight = new THREE.PointLight(0x0000ff, 1.5, 50); 
    bluePointLight.position.set(0, 20, 0); 
    scene.add(bluePointLight);
    // Luce direzionale bianca
    const whiteDirectionalLight = new THREE.DirectionalLight(0xffffff, 1); 
    whiteDirectionalLight.position.set(0, 10, 0); 
    whiteDirectionalLight.target.position.set(0, 0, 0); 
    whiteDirectionalLight.castShadow = true; 
    whiteDirectionalLight.shadow.mapSize.width = 4096; 
    whiteDirectionalLight.shadow.mapSize.height = 4096;
    scene.add(whiteDirectionalLight);
    scene.add(whiteDirectionalLight.target);

    // Crea modelli
    const foto = new CreaModello(contenitore, "foto", "./oggettiScena/foto/fishesInSeaScene.obj", "./oggettiScena/foto/fishesInSeaScene.mtl", [0, 0, 0], false);
    const pesce1 = new CreaModello(contenitore, "pesce1", "./oggettiScena/pesce1/fishesInSeaScene.obj", "./oggettiScena/pesce1/fishesInSeaScene.mtl", [0, 0, 0], false, 0.7);
    const pesce2 = new CreaModello(contenitore, "pesce2", "./oggettiScena/pesce2/fishesInSeaScene.obj", "./oggettiScena/pesce2/fishesInSeaScene.mtl", [0, 0, 0], false, 0.6);
    const pesce3 = new CreaModello(contenitore, "pesce3", "./oggettiScena/pesce3/fishesInSeaScene.obj", "./oggettiScena/pesce3/fishesInSeaScene.mtl", [0, 0, 0], false, 0.8);
    const scrigno = new CreaModello(contenitore, "scrigno", "./oggettiScena/scrigno/fishesInSeaScene.obj", "./oggettiScena/scrigno/fishesInSeaScene.mtl", [0, 0, 0], false);
    const alga1 = new CreaModello(contenitore, "alga1", "./oggettiScena/alga1/fishesInSeaScene.obj", "./oggettiScena/alga1/fishesInSeaScene.mtl", [0, 0, 0], false, 0.006, 5);
    const alga2 = new CreaModello(contenitore, "alga2", "./oggettiScena/alga2/fishesInSeaScene.obj", "./oggettiScena/alga2/fishesInSeaScene.mtl", [0, 0, 0], false, 0.005, 6);
    const alga3 = new CreaModello(contenitore, "alga3", "./oggettiScena/alga3/fishesInSeaScene.obj", "./oggettiScena/alga3/fishesInSeaScene.mtl", [0, 0, 0], false, 0.006, 6);
    const alga4 = new CreaModello(contenitore, "alga4", "./oggettiScena/alga4/fishesInSeaScene.obj", "./oggettiScena/alga4/fishesInSeaScene.mtl", [0, 0, 0], false, 0.005, 7);
    const alga5 = new CreaModello(contenitore, "alga5", "./oggettiScena/alga5/fishesInSeaScene.obj", "./oggettiScena/alga5/fishesInSeaScene.mtl", [0, 0, 0], false, 0.006, 8);
    const scoglio1 = new CreaModello(contenitore, "scoglio1", "./oggettiScena/scoglio1/fishesInSeaScene.obj", "./oggettiScena/scoglio1/fishesInSeaScene.mtl", [0, 0, 0], false);
    const scoglio2 = new CreaModello(contenitore, "scoglio2", "./oggettiScena/scoglio2/fishesInSeaScene.obj", "./oggettiScena/scoglio2/fishesInSeaScene.mtl", [0, 0, 0], false);
    const scoglio3 = new CreaModello(contenitore, "scoglio3", "./oggettiScena/scoglio3/fishesInSeaScene.obj", "./oggettiScena/scoglio3/fishesInSeaScene.mtl", [0, 0, 0], false);
    const scoglio4 = new CreaModello(contenitore, "scoglio4", "./oggettiScena/scoglio4/fishesInSeaScene.obj", "./oggettiScena/scoglio4/fishesInSeaScene.mtl", [0, 0, 0], false);
    const star = new CreaModello(contenitore, "star", "./oggettiScena/star/fishesInSeaScene.obj", "./oggettiScena/star/fishesInSeaScene.mtl", [0, -0.01, 0], false, 0.1);
    const roccia1 = new CreaModello(contenitore, "roccia1", "./oggettiScena/roccia1/fishesInSeaScene.obj", "./oggettiScena/roccia1/fishesInSeaScene.mtl", [0, 0, 0], false);
    const roccia2 = new CreaModello(contenitore, "roccia2", "./oggettiScena/roccia2/fishesInSeaScene.obj", "./oggettiScena/roccia2/fishesInSeaScene.mtl", [0, -0.2, 0], false);
    const roccia3 = new CreaModello(contenitore, "roccia3", "./oggettiScena/roccia3/fishesInSeaScene.obj", "./oggettiScena/roccia3/fishesInSeaScene.mtl", [0, 0, 0], false);
    const sabbia = new CreaModello(contenitore, "sabbia", "./oggettiScena/sabbia/fishesInSeaScene.obj", "./oggettiScena/sabbia/fishesInSeaScene.mtl", [0, 0, 0], false);
    const cubo = new CreaModello(contenitore, "cubo", "./oggettiScena/cuboScena/fishesInSeaScene.obj", "./oggettiScena/cuboScena/fishesInSeaScene.mtl", [0, 0, 0], false);
   
    models.push(foto, pesce1, pesce2, pesce3, scrigno, alga1, alga2, alga3, alga4, alga5,
        scoglio1, scoglio2, scoglio3, scoglio4, star, roccia1, roccia2, roccia3, sabbia, cubo);

    GUI(bluePointLight, whiteDirectionalLight, cubo, movement);

    onWindowResize();

    animate();
}

function onWindowResize() {
    const canvas = document.getElementById('mycanvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Mantenere il canvas quadrato: setta width e height allo stesso valore
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, width); // Assicura un canvas quadrato
}
window.addEventListener('resize', onWindowResize);

function animate() {
    requestAnimationFrame(animate);

    // Aggiorna il movimento per ciascun modello nella lista
    models.forEach((model) => {
        if (model.updateMovement) {
            model.updateMovement();
        }
    });

    moveKeys(movement);

    movement.update();

    // Rendi la scena
    renderer.render(scene, camera);
}

init();

