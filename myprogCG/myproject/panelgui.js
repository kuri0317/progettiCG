//gui
function GUI() {
    const enableGuiCheckbox = document.getElementById('enable-gui');
    const controlLightColor = document.getElementById('control-light-color');
    const controlLx = document.getElementById('control-lx');
    const controlLy = document.getElementById('control-ly');
    const controlLz = document.getElementById('control-lz');
    const controlAlpha = document.getElementById('control-alpha');


    enableGuiCheckbox.addEventListener('change', (event) => {
        controlli.enable = event.target.checked;

        const isEnabled = controlli.enable;
        controlLightColor.disabled = !isEnabled;
        controlLx.disabled = !isEnabled;
        controlLy.disabled = !isEnabled;
        controlLz.disabled = !isEnabled;
        controlAlpha.disabled = !isEnabled;

        updateInstructions();
    });

    controlLightColor.addEventListener('input', (event) => {
        if (controlli.enable) {
            controlli.pointLightColor = hexToRgbArray(event.target.value);
            updatePointLightColor();
        }
    });

    controlLx.addEventListener('input', (event) => {
        if (controlli.enable) {
            controlli.lx = parseFloat(event.target.value);
            updateAmbientLightPosition();
        }
    });

    controlLy.addEventListener('input', (event) => {
        if (controlli.enable) {
            controlli.ly = parseFloat(event.target.value);
            updateAmbientLightPosition();
        }
    });

    controlLz.addEventListener('input', (event) => {
        if (controlli.enable) {
            controlli.lz = parseFloat(event.target.value);
            updateAmbientLightPosition();
        }
    });

    controlAlpha.addEventListener('input', (event) => {
        if (controlli.enable) {
            controlli.alpha = parseFloat(event.target.value);
            updateAlpha();
        }
    });

}

function updateAmbientLightPosition() {
    if (controlli.enable) { 
        gl.uniform3fv(gl.getUniformLocation(programInfo.program, "u_lightDirection"), m4.normalize([light_x, light_y, light_z]));
    }else {
        gl.uniform3fv(gl.getUniformLocation(programInfo.program, "u_lightDirection"), m4.normalize([0, 10, 0]));
    }
}

function updatePointLightColor() {
    if (controlli.enable) {
        gl.uniform3fv(gl.getUniformLocation(programInfo.program, "u_pointLightColor"), controlli.pointLightColor);
    }
}

function updateAlpha() {
    const cubeAlpha = controlli.enable ? controlli.alpha : 0.2;
    gl.uniform1f(gl.getUniformLocation(programInfo.program, "uAlpha"), cubeAlpha);
}

function updateInstructions() {
    if (controlli.enable) {
        instructionTexts[0] = "Controlli abilitati: Modifica i parametri della GUI.";
    } else {
        instructionTexts[0] = "Controlli disabilitati: Usa i parametri globali.";
    }
    disegnaIstruzioni();
}

function disegnaIstruzioni() {
    const instructionCanvas = document.getElementById('instructionCanvas');
    const ctx = instructionCanvas.getContext('2d');

    ctx.clearRect(0, 0, instructionCanvas.width, instructionCanvas.height);

    ctx.font = "18px 'Century Gothic', Arial, sans-serif";
    ctx.fillStyle = "white";
    let yOffset = 30; 

    ctx.fillText("Libretto istruzioni", 110, yOffset);
    yOffset += 50;
    wrapText(ctx, "Abilita o Disabilita i controlli della GUI per modificare le luci", 10, yOffset, 320, 30);
    yOffset += 70;

    const instructions = [
        "Premi W/S per muoverti avanti/indietro",
        "Premi A/D per muoverti sinistra/destra",
        "Premi Q/E per muoverti alto/basso",
        "Premi R per resettare l'inclinazione",
        "Usa la rotellina del mouse per fare zoom in e out"
    ];

    instructions.forEach((text) => {
        wrapText(ctx, text, 10, yOffset, 320, 20);
        yOffset += 50;
    });

    
    const baseYOffset = 480;   
    const arrowXCenter = instructionCanvas.width / 2;  

    drawArrow(ctx, arrowXCenter, baseYOffset, "up");      
    drawArrow(ctx, arrowXCenter, baseYOffset + 80, "down");  
    drawArrow(ctx, arrowXCenter - 75, baseYOffset + 40, "left");  
    drawArrow(ctx, arrowXCenter + 75, baseYOffset + 40, "right");

    const resetX = arrowXCenter;
    const resetY = baseYOffset + 160;

    ctx.beginPath();
    ctx.ellipse(resetX, resetY, 80, 25, 0, 0, 2 * Math.PI); 
    ctx.fillStyle = "#4fb1cf"; 
    ctx.fill();

    ctx.strokeStyle = "#1f5de4";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = "white";
    ctx.font = "bold 16px 'Century Gothic', Arial, sans-serif";
    ctx.fillText("reset", resetX - 20, resetY + 5);
}

// Funzione per disegnare una freccia
function drawArrow(ctx, x, y, direction) {
    const keySize = 60; 
    const cornerRadius = 15; 

    ctx.beginPath();
    ctx.moveTo(x - keySize / 2 + cornerRadius, y - keySize / 2);
    ctx.arcTo(x + keySize / 2, y - keySize / 2, x + keySize / 2, y + keySize / 2, cornerRadius);
    ctx.arcTo(x + keySize / 2, y + keySize / 2, x - keySize / 2, y + keySize / 2, cornerRadius);
    ctx.arcTo(x - keySize / 2, y + keySize / 2, x - keySize / 2, y - keySize / 2, cornerRadius);
    ctx.arcTo(x - keySize / 2, y - keySize / 2, x + keySize / 2, y - keySize / 2, cornerRadius);
    ctx.closePath();

    ctx.fillStyle = "#4fb1cf"; 
    ctx.fill();

    ctx.strokeStyle = "#1f5de4";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "white";
    const arrowSize = 10;

    switch (direction) {
        case "up":
            ctx.moveTo(x, y - arrowSize);
            ctx.lineTo(x - arrowSize, y + arrowSize);
            ctx.lineTo(x + arrowSize, y + arrowSize);
            break;
        case "down":
            ctx.moveTo(x, y + arrowSize);
            ctx.lineTo(x - arrowSize, y - arrowSize); 
            ctx.lineTo(x + arrowSize, y - arrowSize);
            break;
        case "left":
            ctx.moveTo(x - arrowSize, y);
            ctx.lineTo(x + arrowSize, y - arrowSize);
            ctx.lineTo(x + arrowSize, y + arrowSize);
            break;
        case "right":
            ctx.moveTo(x + arrowSize, y);
            ctx.lineTo(x - arrowSize, y - arrowSize);
            ctx.lineTo(x - arrowSize, y + arrowSize);
            break;
    }
    ctx.closePath();
    ctx.fill();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = ' ';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;  
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}


disegnaIstruzioni();

document.getElementById('instructionCanvas').addEventListener('click', handleClick);

function handleClick(event) {
    const rect = instructionCanvas.getBoundingClientRect();

    const scaleX = instructionCanvas.width / rect.width;
    const scaleY = instructionCanvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const arrowXCenter = instructionCanvas.width / 2;
    const baseYOffset = 480;

    if (x >= arrowXCenter - 30 && x <= arrowXCenter + 30 && y >= baseYOffset - 30 && y <= baseYOffset + 30) {
        movement.moveForward(0.25);
    }

    const downArrowYOffset = baseYOffset + 80;
    if (x >= arrowXCenter - 30 && x <= arrowXCenter + 30 && y >= downArrowYOffset - 30 && y <= downArrowYOffset + 30) {
        movement.moveForward(-0.25);
    }

    const leftArrowXOffset = arrowXCenter - 75;
    const leftArrowYOffset = baseYOffset + 40;
    if (x >= leftArrowXOffset - 30 && x <= leftArrowXOffset + 30 && y >= leftArrowYOffset - 30 && y <= leftArrowYOffset + 30) {
        movement.moveRight(-0.25);
    }

    const rightArrowXOffset = arrowXCenter + 75;
    const rightArrowYOffset = baseYOffset + 40;
    if (x >= rightArrowXOffset - 30 && x <= rightArrowXOffset + 30 && y >= rightArrowYOffset - 30 && y <= rightArrowYOffset + 30) {
        movement.moveRight(0.25);
    }

    const resetX = arrowXCenter;
    const resetY = baseYOffset + 160;
    const resetRadiusX = 80;
    const resetRadiusY = 25;

    if (((x - resetX) ** 2) / (resetRadiusX ** 2) + ((y - resetY) ** 2) / (resetRadiusY ** 2) <= 1) {
        movement.reset();
    }
}
