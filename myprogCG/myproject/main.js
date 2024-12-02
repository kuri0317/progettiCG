//main
"use strict";

var canvas, gl; 
var programInfo; 
var mesh_list=[];

//var per posizione, normale e coord texture
var positions = [];
var normals = [];
var texcoords = [];

var numVertices;
var ambient;   //Ka
var diffuse;   //Kd
var specular;  //Ks
var emissive;  //Ke
var shininess; //Ns
var opacity;   //Ni
var ambientLight = [0.12, 0.12, 0.2];
var colorLight = [1.0, 1.0, 1.0];
var light_x=0, light_y=10, light_z=0;

var movement;
var pX = -10, pY = 6, pZ = -10;
var position = [pX, pY, pZ];
var up = [0, 1, 0];
var target = [0, 0, 0];

//per gestione gui
var controlli= {
    lx: 0,
    ly: 10,
    lz: 0,
    theta: 0,
    phi: 0,
    alpha: 0.2,
    fovy:0,
    enable: false
}
var THETA;
var PHI;
var AMORTIZATION=0.75;
var drag=false;
var old_x, old_y;
var dX=0, dY=0;

function main(){
    Canvas();
    programInfo = webglUtils.createProgramInfo(gl, ["3d-vertex-shader", "3d-fragment-shader"]);
    gl.useProgram(programInfo.program);
    
    GUI();
    //movimenti mouse
    movement = new Movement(position, target, up); 
    move();

    //crea i modelli
    var foto = new creaModello("foto", "./oggettiScena/foto/fishesInSeaScene.obj", "./oggettiScena/foto/fishesInSeaScene.mtl", [0, 0, 0], false);
    var pesce1 = new creaModello("pesce1", "./oggettiScena/pesce1/fishesInSeaScene.obj", "./oggettiScena/pesce1/fishesInSeaScene.mtl", [0, 0, 0], false, 0.4);
    var pesce2 = new creaModello("pesce2", "./oggettiScena/pesce2/fishesInSeaScene.obj", "./oggettiScena/pesce2/fishesInSeaScene.mtl", [0, 0, 0], false, 0.8);
    var pesce3 = new creaModello("pesce3", "./oggettiScena/pesce3/fishesInSeaScene.obj", "./oggettiScena/pesce3/fishesInSeaScene.mtl", [0, 0, 0], false, 0.8);
    var scrigno = new creaModello("scrigno", "./oggettiScena/scrigno/fishesInSeaScene.obj", "./oggettiScena/scrigno/fishesInSeaScene.mtl", [0, 0, 0], false);
    var alga1 = new creaModello("alga1", "./oggettiScena/alga1/fishesInSeaScene.obj", "./oggettiScena/alga1/fishesInSeaScene.mtl", [0, 0, 0], false, 0.019, 0.006);
    var alga2 = new creaModello("alga2", "./oggettiScena/alga2/fishesInSeaScene.obj", "./oggettiScena/alga2/fishesInSeaScene.mtl", [0, 0, 0], false, 0.018, 0.0058);
    var alga3 = new creaModello("alga3", "./oggettiScena/alga3/fishesInSeaScene.obj", "./oggettiScena/alga3/fishesInSeaScene.mtl", [0, 0, 0], false, 0.018, 0.0075);
    var alga4 = new creaModello("alga4", "./oggettiScena/alga4/fishesInSeaScene.obj", "./oggettiScena/alga4/fishesInSeaScene.mtl", [0, 0, 0], false, 0.01, 0.0048);
    var alga5 = new creaModello("alga5", "./oggettiScena/alga5/fishesInSeaScene.obj", "./oggettiScena/alga5/fishesInSeaScene.mtl", [0, 0, 0], false, 0.015, 0.005);
    var scoglio1 = new creaModello("scoglio1", "./oggettiScena/scoglio1/fishesInSeaScene.obj", "./oggettiScena/scoglio1/fishesInSeaScene.mtl", [0, 0, 0], false);
    var scoglio2 = new creaModello("scoglio2", "./oggettiScena/scoglio2/fishesInSeaScene.obj", "./oggettiScena/scoglio2/fishesInSeaScene.mtl", [0, 0, 0], false);
    var scoglio3 = new creaModello("scoglio3", "./oggettiScena/scoglio3/fishesInSeaScene.obj", "./oggettiScena/scoglio3/fishesInSeaScene.mtl", [0, 0, 0], false);
    var scoglio4 = new creaModello("scoglio4", "./oggettiScena/scoglio4/fishesInSeaScene.obj", "./oggettiScena/scoglio4/fishesInSeaScene.mtl", [0, 0, 0], false);
    var star = new creaModello("star", "./oggettiScena/star/fishesInSeaScene.obj", "./oggettiScena/star/fishesInSeaScene.mtl", [0, -0.01, 0], false, 0.1);
    var roccia1 = new creaModello("roccia1", "./oggettiScena/roccia1/fishesInSeaScene.obj", "./oggettiScena/roccia1/fishesInSeaScene.mtl", [0, 0, 0], false);
    var roccia2 = new creaModello("roccia2", "./oggettiScena/roccia2/fishesInSeaScene.obj", "./oggettiScena/roccia2/fishesInSeaScene.mtl", [0, -0.2, 0], false);
    var roccia3 = new creaModello("roccia3", "./oggettiScena/roccia3/fishesInSeaScene.obj", "./oggettiScena/roccia3/fishesInSeaScene.mtl", [0, 0, 0], false);
    var sabbia = new creaModello("sabbia", "./oggettiScena/sabbia/fishesInSeaScene.obj", "./oggettiScena/sabbia/fishesInSeaScene.mtl", [0, 0, 0], false);
    var cubo = new creaModello("cubo", "./oggettiScena/cuboScena/fishesInSeaScene.obj", "./oggettiScena/cuboScena/fishesInSeaScene.mtl", [0, 0, 0], false);
    
    //disegna modelli
    disegnaModelli();
    disegnaIstruzioni();
}

function Canvas() {

    canvas = document.getElementById("mycanvas");
    gl = canvas.getContext("webgl");

    if (!gl) {
        alert("WebGL is not supported in your browser, trying experimental WebGL");
        gl = canvas.getContext('experimental-webgl'); //browser Safari/Edge/IE
        if (!gl) {
            alert("Even experimental WebGL is not supported");
            throw new Error("WebGL is not supported!");
        }
    }
    if (!gl.getExtension("WEBGL_depth_texture")) {
        throw new Error("need WEBGL_depth_texture");
    }
   
}
window.addEventListener('resize', function (){});

function adjustLayout() {
    const container = document.querySelector('.container');
    const backgroundCanvas = document.getElementById('backgroundCanvas');
    const myCanvas = document.getElementById('mycanvas');

    if (backgroundCanvas.clientWidth > myCanvas.clientWidth) {
        container.style.flexDirection = 'column';
        backgroundCanvas.style.margin = '20px auto';
        myCanvas.style.alignSelf = 'center';
    } else {
        container.style.flexDirection = 'row';
        backgroundCanvas.style.margin = '0';
        myCanvas.style.alignSelf = 'flex-start';
        myCanvas.style.margin = '0 0 20px auto';
    }
}

main();

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function hexToRgbArray(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b];
}

