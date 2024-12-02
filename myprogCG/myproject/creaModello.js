//passare gli oggetti a loadmesh per visualizzarli
class creaModello{
    constructor(objName, objSource, objMtl, objPosition, objRotate, movementAmplitude = 0.15,movementFrequency = 0.001) {

		this.name = objName;
		this.obj_source = objSource;
		this.mtl_source = objMtl;
		this.position = objPosition;
		this.mesh = []; 
		this.mesh.sourceMesh = this.obj_source; // .sourceMesh viene usato per caricare con load_mesh.js
		this.mesh.fileMTL = this.mtl_source; // caricare la texture

		this.scale = [1, 1, 1]; // Scala default
        
        this.timeOffset = Math.random() * 1000;
        this.originalPosition = objPosition.slice(); // Salva la posizione iniziale
        this.movementOffset = 0; 
        this.movementAmplitude = movementAmplitude;
        this.movementFrequency = movementFrequency;

		if (objRotate) { // per world matrix transform
			this.rotate = objRotate;
			this.angle = 0;
		}

		LoadMesh(gl, this.mesh).then(() => { 
            mesh_list.push(this); 
            this.createBuffer(programInfo); 
        });
    }

    createBuffer(programInfo){
        let m =this.mesh 

        //posizioni vertici 
        this.positionLocation = gl.getAttribLocation(programInfo.program, "a_position");
		this.normalLocation = gl.getAttribLocation(programInfo.program, "a_normal");
		this.texcoordLocation = gl.getAttribLocation(programInfo.program, "a_texcoord");

        //buffer per posizione
        this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.positions), gl.STATIC_DRAW); //metti posizione nel buffer

        //buffer per normali
        this.normalsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.normals), gl.STATIC_DRAW); //metti le normali ne buffer

        //coordinate per texture
        this.texcoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.texcoords), gl.STATIC_DRAW);

    }

    updateAlgheMovement() {
        const time = Date.now() * this.movementFrequency + this.timeOffset;
    
        let rotationAngle = Math.sin(time) * this.movementAmplitude;
        this.position[0] = this.originalPosition[0] + Math.sin(time * 0.5) * this.movementAmplitude * 0.05;
    
        this.rotationY = rotationAngle; 
        this.position[1] = this.originalPosition[1] + Math.sin(time * 0.3) * this.movementAmplitude * 0.02; 
    }
    

    updateMovement() { //movimenti alghe pesci e stella
        if (this.name.includes("alga")) {
            this.updateAlgheMovement();
        } else {
            const time = Date.now() * 0.001 + this.timeOffset;
            this.movementOffset = Math.sin(time) * this.movementAmplitude;
            this.position[1] = this.originalPosition[1] + this.movementOffset;
        }
    }

    draw(fieldOfViewRadians = degToRad(60), zmin = 0.1, far = 100, light_x = 0, light_y = 10, light_z = 0){
        let m=this.mesh 

        //matrice di proiezione
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zmin, far)

        //matrice di vista
        var viewMatrix = movement.getViewMatrix();
        
        gl.uniform3fv(gl.getUniformLocation(programInfo.program, "diffuse"), m.diffuse);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "ambient"), m.ambient);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "specular"), m.specular);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "emissive"), m.emissive);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "u_ambientLight"), ambientLight);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "u_colorLight"), colorLight);
		gl.uniform1f(gl.getUniformLocation(programInfo.program, "shininess"), m.shininess)
		gl.uniform1f(gl.getUniformLocation(programInfo.program, "opacity"), m.opacity)
		
        //accedi a pos attrb
        gl.enableVertexAttribArray(this.positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        var size = 3;         
		var type = gl.FLOAT;   
		var normalize = false; 
		var stride = 0;       
		var offset = 0;       
		gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);

        //attributo normale
        gl.enableVertexAttribArray(this.normalLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
		gl.vertexAttribPointer(this.normalLocation, size, type, normalize, stride, offset);

        //attributo texture
        gl.enableVertexAttribArray(this.texcoordLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

        size=2;
        gl.vertexAttribPointer(this.texcoordLocation, size, type, normalize, stride, offset)

		gl.bindTexture(gl.TEXTURE_2D, this.mesh.texture);

        var matrixLocation = gl.getUniformLocation(programInfo.program, "u_world");
		var textureLocation = gl.getUniformLocation(programInfo.program, "diffuseMap");
		var viewMatrixLocation = gl.getUniformLocation(programInfo.program, "u_view");
		var projectionMatrixLocation = gl.getUniformLocation(programInfo.program, "u_projection");
		var lightWorldDirectionLocation = gl.getUniformLocation(programInfo.program, "u_lightDirection");
		var viewWorldPositionLocation = gl.getUniformLocation(programInfo.program, "u_viewWorldPosition");

        var pointLightPositionLocation = gl.getUniformLocation(programInfo.program, "u_pointLightPosition");
        gl.uniform3fv(pointLightPositionLocation, [0, 30, 0]); 
        
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
		gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

        //posizione luce
        gl.uniform3fv(lightWorldDirectionLocation, m4.normalize([light_x, light_y, light_z]));
        //posizione camera
        gl.uniform3fv(viewWorldPositionLocation,movement.getPosition());
        //lo shader deve usare textute unit 0 per diffuseMap
        gl.uniform1i(textureLocation, 0);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.enable(gl.CULL_FACE);

        var rotationMatrix = movement.getRotationMatrix();
        
        if (this.name === "star" || this.name.includes("pesce")|| this.name.includes("alga") ) {
            this.updateMovement();
        }

        //Combina la matrice di rotazione con la matrice del modello
        var modelMatrix = m4.identity();
        modelMatrix = m4.translate(modelMatrix, this.position[0], this.position[1], this.position[2]); 
        if (this.name.includes("alga")) {
            modelMatrix = m4.yRotate(modelMatrix, this.rotationY);
        }
        modelMatrix = m4.multiply(rotationMatrix, modelMatrix); 
        modelMatrix = m4.scale(modelMatrix, this.scale[0], this.scale[1], this.scale[2]); 


		gl.uniformMatrix4fv(matrixLocation, false, modelMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, this.mesh.numVertices);

    }
}

function disegnaModelli(){

    movement.update();
    moveKeys();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.clearColor(0, 0, 0, 1);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    updateAmbientLightPosition();

    const defaultBlueColor = [0.0, 0.0, 1.0];

    const pointLightColor = controlli.enable && controlli.pointLightColor 
        ? controlli.pointLightColor 
        : defaultBlueColor;
    gl.uniform3fv(gl.getUniformLocation(programInfo.program, "u_pointLightColor"), pointLightColor);

    mesh_list.forEach(function(mesh){
        
        if(mesh.name == "cubo"){
            const cubeAlpha = controlli.enable ? controlli.alpha : 0.2;
            gl.uniform1f(gl.getUniformLocation(programInfo.program, "uAlpha"), cubeAlpha); 
            gl.disable(gl.CULL_FACE); 
            mesh.draw();
        }
        if(mesh.name == "foto"){
            gl.cullFace(gl.FRONT);
            mesh.draw();
        }        
        else{
            gl.cullFace(gl.BACK);
            gl.uniform1f(gl.getUniformLocation(programInfo.program, "uAlpha"), 1.0); 
        }
        if(controlli.enable){
            mesh.draw(
                degToRad(controlli.fovy || 60), 
                0.1, 
                100, 
                controlli.lx, 
                controlli.ly, 
                controlli.lz
            );

        }else{
            mesh.draw();
        }
    });

    requestAnimationFrame(disegnaModelli);
}