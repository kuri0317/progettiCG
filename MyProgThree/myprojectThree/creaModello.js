class CreaModello{
    constructor(scene, objName, objSource, mtlSource, objPosition, objRotate, movementAmplitude = 0.15, movementFrequency = 0.001) {
        this.name = objName;
        this.objSource = objSource;
        this.mtlSource = mtlSource;
        this.position = new THREE.Vector3(...objPosition);
        this.mesh = null; // Mesh di Three.js

        this.scale = new THREE.Vector3(1, 1, 1); 
        this.movementAmplitude = movementAmplitude;
        this.movementFrequency = movementFrequency;
        this.timeOffset = Math.random() * 1000;
        

		if (objRotate) { // per world matrix transform
			this.rotate = objRotate;
			this.angle = 0;
		}

        const mtlLoader =new THREE.MTLLoader();
        mtlLoader.load(this.mtlSource, (materials) => {
            
            // Caricamento dell'oggetto con i materiali
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(this.objSource, (object) => {

                const textureLoader = new THREE.TextureLoader();

                object.traverse((child) => {
                    if (child.isMesh) {
                        
                        // Carica le texture in base al nome
                        if (this.name.includes("roccia")) {
                            const texture = textureLoader.load('./oggettiScena/roccia1/Rock020_1K-PNG_Color.png', (texture) => {
                                texture.minFilter = THREE.LinearFilter;
                                child.material = new THREE.MeshPhongMaterial({
                                map: texture
                                });
                            });
                            
                        } else if (this.name.includes("scoglio")) {
                            const texture = textureLoader.load('./oggettiScena/scoglio1/Rock020_1K-PNG_Color.png', (texture) => {
                                texture.minFilter = THREE.LinearFilter;
                                child.material = new THREE.MeshPhongMaterial({
                                map: texture
                                });
                            });
                        } else if (this.name.includes("sabbia")) {
                            const texture = textureLoader.load('./oggettiScena/sabbia/Ground080_2K-JPG_Color.jpg', (texture) => {
                                texture.minFilter = THREE.LinearFilter;
                                child.material = new THREE.MeshPhongMaterial({
                                map: texture
                                });
                            });
                        } else if (this.name.includes("foto")) {
                            const texture = textureLoader.load('./oggettiScena/foto/idPHoto.png', (texture) => {
                                texture.minFilter = THREE.LinearFilter;
                                child.material = new THREE.MeshPhongMaterial({
                                map: texture,
                                side: THREE.DoubleSide 
                                });
                            });
                        }
                        else {
                            child.material = child.material;
                        }
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Posiziona modello
                object.position.copy(this.position);
                this.mesh = object;
                scene.add(this.mesh);
            });
        })
    }

    updateMovement() {
        if (this.mesh) {
            const time = Date.now() * 0.001 + this.timeOffset;

            if (this.name.includes("alga")) {
                let rotationAngle = Math.sin(time * this.movementFrequency) * this.movementAmplitude * 2;
                this.mesh.rotation.y = rotationAngle;

                this.mesh.position.x = this.position.x + Math.sin(time * 0.5) * this.movementAmplitude * 0.2;
                this.mesh.position.y = this.position.y + Math.sin(time * 0.3) * this.movementAmplitude * 0.07;

            } else if (this.name.includes("pesce")) {
                this.mesh.position.y = this.position.y + Math.sin(time) * this.movementAmplitude;
                this.mesh.position.x = this.position.x + Math.cos(time * 0.5) * this.movementAmplitude * 0.1;

            } else if (this.name.includes("star")) {
                this.mesh.position.y = this.position.y + Math.sin(time) * this.movementAmplitude * 1.15; // Sotto sabbia
            this.mesh.position.x = this.position.x + Math.cos(time * 0.5) * this.movementAmplitude * 0.1;
            }
        }
    }
}

export { CreaModello };
