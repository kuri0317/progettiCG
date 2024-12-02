let movementInstance;
function GUI(bluePointLight, whiteDirectionalLight, cube, movement) {
    movementInstance = movement;

    const enableGuiCheckbox = document.getElementById('enable-gui');
    const controlLightColor = document.getElementById('control-light-color');
    const controlLx = document.getElementById('control-lx');
    const controlLy = document.getElementById('control-ly');
    const controlLz = document.getElementById('control-lz');
    const controlAlpha = document.getElementById('control-alpha');
    
    controlLightColor.disabled = true;
    controlLx.disabled = true;
    controlLy.disabled = true;
    controlLz.disabled = true;
    controlAlpha.disabled = true;

    const userSettings = {
        lightColor: bluePointLight.color.getHex(),
        lightPosition: {
            x: whiteDirectionalLight.position.x,
            y: whiteDirectionalLight.position.y,
            z: whiteDirectionalLight.position.z,
        },
        cubeOpacity: 0.25, 
    };

    enableGuiCheckbox.addEventListener('change', (event) => {
        const isEnabled = event.target.checked;

        controlLightColor.disabled = !isEnabled;
        controlLx.disabled = !isEnabled;
        controlLy.disabled = !isEnabled;
        controlLz.disabled = !isEnabled;
        controlAlpha.disabled = !isEnabled;

        if (!isEnabled) {
            saveUserSettings();
            resetToDefault();
        }else {
            restoreUserSettings();
        }
    });

    // event listener per aggiornare i controlli 
    controlLightColor.addEventListener('input', (event) => {
        if (!controlLightColor.disabled) {
            const color = event.target.value;
            bluePointLight.color.set(color); 
            userSettings.lightColor = bluePointLight.color.getHex();
        }
    });
    function updateDirectionalLightPosition() {
        if (!controlLx.disabled && !controlLy.disabled && !controlLz.disabled) {
            const lx = parseFloat(controlLx.value);
            const ly = parseFloat(controlLy.value);
            const lz = parseFloat(controlLz.value);
            whiteDirectionalLight.position.set(lx, ly, lz);
            whiteDirectionalLight.target.position.set(0, 0, 0); 
            
            userSettings.lightPosition.x = lx;
            userSettings.lightPosition.y = ly;
            userSettings.lightPosition.z = lz;
        }
    }

    controlLx.addEventListener('input', updateDirectionalLightPosition);
    controlLy.addEventListener('input', updateDirectionalLightPosition);
    controlLz.addEventListener('input', updateDirectionalLightPosition);

    controlAlpha.addEventListener('input', (event) => {
        if (!controlAlpha.disabled) {
            const alpha = parseFloat(event.target.value);
            if (cube.mesh) {
                cube.mesh.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.transparent = true; // Abilita trasparenza
                        child.material.opacity = alpha; // Aggiorna l'opacità 
                    }
                });
            } 
            userSettings.cubeOpacity = alpha;
        }
    });
    // Funzione per ripristinare i valori di default 
    function resetToDefault() {
        bluePointLight.color.set(0x0000ff); 
        whiteDirectionalLight.position.set(0, 10, 0);
        if (cube.mesh) {
            cube.mesh.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.opacity = 0.25; 
                }
            });
        } 
    }
    function restoreUserSettings() {
    
        controlLightColor.value = `#${userSettings.lightColor.toString(16).padStart(6, '0')}`;
        controlLx.value = userSettings.lightPosition.x;
        controlLy.value = userSettings.lightPosition.y;
        controlLz.value = userSettings.lightPosition.z;
        controlAlpha.value = userSettings.cubeOpacity;

        bluePointLight.color.set(userSettings.lightColor);
        whiteDirectionalLight.position.set(userSettings.lightPosition.x, userSettings.lightPosition.y, userSettings.lightPosition.z);
            if (cube.mesh) {
                cube.mesh.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.transparent = true; // Abilita trasparenza
                        child.material.opacity = userSettings.cubeOpacity;
                    }
                });
            }
    }
    function saveUserSettings() {
        userSettings.lightColor = bluePointLight.color.getHex();
        userSettings.lightPosition.x = whiteDirectionalLight.position.x;
        userSettings.lightPosition.y = whiteDirectionalLight.position.y;
        userSettings.lightPosition.z = whiteDirectionalLight.position.z;
        userSettings.cubeOpacity = controlAlpha.value;
    }
    
    const instructionCanvas = document.getElementById('instructionCanvas');
    instructionCanvas.addEventListener('click', (event) => {
        handleInstructionClick(event);
    });

    instructionCanvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        handleInstructionClick({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    });

    function updateAndDrawIstruzioni() {
        const instructionCanvas = document.getElementById('instructionCanvas');
        const ctx = instructionCanvas.getContext('2d');

        ctx.clearRect(0, 0, instructionCanvas.width, instructionCanvas.height);

        // Controllo del messaggio delle istruzioni
        const message = enableGuiCheckbox.checked
            ? "Controlli abilitati: Modifica i parametri della GUI."
            : "Controlli disabilitati: Usa i parametri globali.";
        
        ctx.font = "18px 'Century Gothic', Arial, sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("Libretto istruzioni", 110, 30);
        wrapText(ctx, message, 10, 80, 320, 30);

        const instructions = [
            "Premi W/S per muoverti avanti/indietro",
            "Premi A/D per muoverti sinistra/destra",
            "Premi Q/E per muoverti alto/basso",
            "Premi R per resettare l'inclinazione",
            "Usa la rotellina del mouse per fare zoom in e out"
        ];

        let yOffset = 150;
        instructions.forEach(text => {
            wrapText(ctx, text, 10, yOffset, 320, 20);
            yOffset += 50;
        });

        drawArrow(ctx, instructionCanvas.width / 2, 480, "up");
        drawArrow(ctx, instructionCanvas.width / 2, 560, "down");
        drawArrow(ctx, instructionCanvas.width / 2 - 75, 520, "left");
        drawArrow(ctx, instructionCanvas.width / 2 + 75, 520, "right");
        drawResetButton(ctx, instructionCanvas.width / 2, 640);
    }

    function drawRoundedRect(ctx, x, y, width, height, radius, fillColor, strokeColor) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Funzione per disegnare una freccia
    function drawArrow(ctx, x, y, direction) {
        const keySize = 60;
        const cornerRadius = 15;

        drawRoundedRect(ctx, x - keySize / 2, y - keySize / 2, keySize, keySize, cornerRadius, "#4fb1cf", "#1f5de4");

        ctx.beginPath();
        ctx.fillStyle = "white";
        const arrowSize = 20;

        switch (direction) {
            case "up":
                ctx.moveTo(x, y - arrowSize);
                ctx.lineTo(x - arrowSize / 2, y + arrowSize / 2);
                ctx.lineTo(x + arrowSize / 2, y + arrowSize / 2);
                break;
            case "down":
                ctx.moveTo(x, y + arrowSize);
                ctx.lineTo(x - arrowSize / 2, y - arrowSize / 2);
                ctx.lineTo(x + arrowSize / 2, y - arrowSize / 2);
                break;
            case "left":
                ctx.moveTo(x - arrowSize, y);
                ctx.lineTo(x + arrowSize / 2, y - arrowSize / 2);
                ctx.lineTo(x + arrowSize / 2, y + arrowSize / 2);
                break;
            case "right":
                ctx.moveTo(x + arrowSize, y);
                ctx.lineTo(x - arrowSize / 2, y - arrowSize / 2);
                ctx.lineTo(x - arrowSize / 2, y + arrowSize / 2);
                break;
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawResetButton(ctx, x, y) {
        ctx.beginPath();
        ctx.ellipse(x, y, 80, 25, 0, 0, 2 * Math.PI); 
        ctx.fillStyle = "#4fb1cf"; 
        ctx.fill();

        ctx.strokeStyle = "#1f5de4";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 16px 'Century Gothic', Arial, sans-serif";
        ctx.fillText("reset", x - 20, y + 5);
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        for (const word of words) {
            const testLine = line + word + ' ';
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth && line !== '') {
                ctx.fillText(line, x, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }


    function handleInstructionClick(event) {
        if (!movementInstance) {
            return;
        }
        
        const rect = instructionCanvas.getBoundingClientRect();
        const scaleX = instructionCanvas.width / rect.width;
        const scaleY = instructionCanvas.height / rect.height;
    
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const arrowXCenter = instructionCanvas.width / 2;
        const baseYOffset = 480;
    
        // Logica per verificare click
        if (checkWithinBounds(x, y, arrowXCenter, baseYOffset, 60)) {
            movementInstance.moveForward(0.25);
        }
        const downArrowYOffset = baseYOffset + 80;
        if (checkWithinBounds(x, y, arrowXCenter, downArrowYOffset, 60)) {
            movementInstance.moveForward(-0.25);
        }
        const leftArrowXOffset = arrowXCenter - 75;
        const leftArrowYOffset = baseYOffset + 40;
        if (checkWithinBounds(x, y, leftArrowXOffset, leftArrowYOffset, 60)) {
            movementInstance.moveRight(-0.25);
        }
        const rightArrowXOffset = arrowXCenter + 75;
        const rightArrowYOffset = baseYOffset + 40;
        if (checkWithinBounds(x, y, rightArrowXOffset, rightArrowYOffset, 60)) {
            movementInstance.moveRight(0.25);
        }
    
        const resetX = arrowXCenter;
        const resetY = baseYOffset + 160;
        const resetRadiusX = 80;
        const resetRadiusY = 25;
    
        if (((x - resetX) ** 2) / (resetRadiusX ** 2) + ((y - resetY) ** 2) / (resetRadiusY ** 2) <= 1) {
            movementInstance.reset();
        }
    }
    function checkWithinBounds(x, y, centerX, centerY, size) {
        return x >= centerX - size / 2 && x <= centerX + size / 2 &&
            y >= centerY - size / 2 && y <= centerY + size / 2;
    }
    
    updateAndDrawIstruzioni();

}
export { GUI };