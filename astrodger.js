//////////////////////////////////////////////////////////////////////////////
//
//  astrodger.js 
//
//  Astrodger
//
//  Reference: E. Angel examples
//
//  J. Madeira - Oct. 2015 + November 2017
//
//	Rui Oliveira 89216
//
//	Rui Santos 89293
//
//  16 de Dezembro de 2020
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;
	
var triangleVertexNormalBuffer = null;	

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalTz = 0;

// GLOBAL Animation controls

var globalRotationYY_ON = 1;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

var pauseMODE = 0;

var justStarted = 1;

// To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// To allow choosing the projection type

var projectionType = 1;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];


//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();;

// Spawn Asteriodes

var spawnCount = 0;

var spawnTop = 50;

var score = 0;

var highscore = 0;

var nivel = 0;

var asteriodesMOVE_ON = 0;

var gameOver = false;

var asteriodeSpeed = 0.8;

var cubeVertexPositionBuffer = null;

var cubeVertexIndexBuffer = null;

var cubeVertexTextureCoordBuffer;


// function countFrames() {
	
//    var now = new Date().getTime();

//    frameCount++;
   
//    elapsedTime += (now - lastfpsTime);

//    lastfpsTime = now;

//    if(elapsedTime >= 1000) {
	   
//        fps = frameCount;
       
//        frameCount = 0;
       
//        elapsedTime -= 1000;
	   
// 	   document.getElementById('fps').innerHTML = 'fps:' + fps;
//    }
// }


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//
function handleLoadedTexture(texture) {

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


var webGLTexture;

function initTexture() {

	webGLTexture = gl.createTexture();
	webGLTexture.image = new Image();
	webGLTexture.image.onload = function () {
		handleLoadedTexture(webGLTexture)
	}

	webGLTexture.image.src = "ice.jpg";
}
// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers( model ) {	
	
	// Vertex Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors
		
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			triangleVertexNormalBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);	


	// Textures Coordinates

	cubeVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
	cubeVertexTextureCoordBuffer.itemSize = 2;
	cubeVertexTextureCoordBuffer.numItems = model.textureCoords.length;

	// console.log(cubeVertexTextureCoordBuffer.numItems)

	// Associating to the vertex shader

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, webGLTexture);

	gl.uniform1i(shaderProgram.samplerUniform, 0);

	// Vertex indices

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.vertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = model.vertexIndices.length;

	// The vertex indices

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

	// Drawing the triangles --- NEW --- DRAWING ELEMENTS 

	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
	
	//mvMatrix = mult( mvMatrix, rotationYYMatrix( globalAngleYY ) );
	
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors
	
	initBuffers(model);
	
	// Material properties
	
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources
	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
    
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing 
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
	if( projectionType == 0 ) {
		
		// For now, the default orthogonal view volume
		
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// Global transformation !!
		
		globalTz = 0.0;
		
		// NEW --- The viewer is on the ZZ axis at an indefinite distance
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		
		pos_Viewer[2] = 1.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	else {	

		// A standard view volume.
		
		// Viewer is at (0,0,0)
		
		// Ensure that the model is "inside" the view volume
		
		pMatrix = perspective( 45, 1, 0.05, 15 );
		
		// Global transformation !!
		
		globalTz = -2.5;

		// NEW --- The viewer is on (0,0,0)
		
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
		
		pos_Viewer[3] = 1.0;  
		
		// TO BE DONE !
		
		// Allow the user to control the size of the view volume
	}
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Passing the viewer position to the vertex shader
	
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	
	mvMatrix = translationMatrix( 0, 0, globalTz );
	//mvMatrix = mult(mvMatrix, rotationYYMatrix(globalAngleYY));
	
	// NEW - Updating the position of the light sources, if required
	
	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models
	
	for(var i = 0; i < sceneModels.length; i++ )
	{ 
		if(sceneModels[i].isActive){
			
			drawModel( sceneModels[i],
				mvMatrix,
				primitiveType );
		}
		
	}

	           
	// NEW - Counting the frames
	
	// countFrames();
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

var elapsed = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		elapsed = timeNow - lastTime;
		
		// Global rotation
		
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// For every model --- Local rotations
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].isActive) {
				if( sceneModels[i].rotXXOn ) {

					sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
				}

				if( sceneModels[i].rotYYOn ) {

					sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
				}

				if( sceneModels[i].rotZZOn ) {

					sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
				}
			}
		}
		
		// Rotating the light sources
		
		if(pauseMODE==0 && justStarted==0){
			for(var i = 0; i < lightSources.length; i++ )
			{
				
				// if( lightSources[i].isRotYYOn() ) {
				// 	var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
			
				// 	lightSources[i].setRotAngleYY( angle );
				// }
				

				var z = lightSources[i].getPosition()[2] + elapsed / 1000;

				lightSources[i].setPosition( lightSources[i].getPosition()[0], lightSources[i].getPosition()[1], z,lightSources[i].getPosition()[3]);
			}
		}

		
}
	
	lastTime = timeNow;
}

function processAsteroids() {

	score++;
	spawnCount++;

	if (gameOver) {
		gameOver = false;
		// window.alert("Game Over");
		
		
		document.getElementById("Pause-asteriode-movement").style.display = "none";
		document.getElementById("Restart-asteriode-movement").style.display = "block";
		document.getElementById("gameover").style.display = "block";
		
		asteriodesMOVE_ON = 0;
		pauseMODE = 1;
		reset();
		return;
	}

	if (score % 500 == 0) {
		if (spawnTop > 5) {
			spawnTop = spawnTop-5;
		}
		asteriodeSpeed += 0.03;
	}

	for (i=0;i<sceneModels.length-1;i++){

		// console.log(sceneModels.length)

		if(sceneModels[i+1].tz >= 3) {
			sceneModels[i+1].isActive = false;
		}
		if (sceneModels[i+1].isActive) {
			//Colisão
			if(sceneModels[0].tx == sceneModels[i+1].tx && sceneModels[0].ty == sceneModels[i+1].ty && ((Math.abs(sceneModels[0].tz - sceneModels[i+1].tz)) < 0.6)){
				gameOver = true;
			}
			//Speed and Spin
			sceneModels[i+1].tz += asteriodeSpeed * elapsed / 100;
			// sceneModels[i+1].rotAngleXX += sceneModels[i+1].rotXXDir * sceneModels[i+1].rotXXSpeed * (90 * elapsed) / 1000.0;
			// sceneModels[i+1].rotYYDir += sceneModels[i+1].rotYYDir * sceneModels[i+1].rotYYSpeed * (90 * elapsed) / 1000.0;
		}
	}
	//New Asteroid
	if (spawnCount >= spawnTop) {
		spawnCount = 0;
		var j = getFreeIndex(); 
		if (getFreeIndex() != -1) {
			sceneModels[j].isActive = true;
			sceneModels[j].tx = (Math.floor(Math.random() * 4) * 0.5) -0.75;
			sceneModels[j].ty = (Math.floor(Math.random() * 4) * 0.5) -0.75; 
			sceneModels[j].tz = -13; 
			var x = (Math.floor(Math.random() * 2));
			if (x == 0) x = -1;
			var y = (Math.floor(Math.random() * 2));
			if (y == 0) y = -1;
			sceneModels[j].rotXXDir = x;
			sceneModels[j].rotYYDir = y;
			sceneModels[j].rotXXSpeed = (Math.floor(Math.random() * 6) + 1) / 5;
			sceneModels[j].rotYYSpeed = (Math.floor(Math.random() * 6) + 1) / 5;
		}
	}
}

function getFreeIndex() {
	for (i=0;i<sceneModels.length-1;i++){
		if (!sceneModels[i+1].isActive) return i+1;
	}
	return -1;
}


function reset() {
	if(score>highscore) highscore = score;
	//score = 0;
	spawnTop = 50;
	spawnCount = 0;
	asteriodeSpeed = 0.8;
	for (i=0;i<sceneModels.length-1;i++){
		sceneModels[i+1].isActive=false;
	}
	tx = -0.25;
	ty = -0.25;
	return -1;
}


//----------------------------------------------------------------------------

// Timer

function tick() {

	document.getElementById('ScoreLabel').innerHTML = score;
	document.getElementById('HighScoreLabel').innerHTML = highscore;
	nivel = Math.floor((score)/500)+1;
	document.getElementById('Nivel').innerHTML = nivel;
	
	requestAnimFrame(tick);
	
	if (asteriodesMOVE_ON==1) processAsteroids();
	
	drawScene();
	
	animate();

	
}


//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
    
}

//----------------------------------------------------------------------------

function setEventListeners(){
	
	
	// Key events
	document.addEventListener("keypress", function(event) {

		if(pauseMODE==0){
			var key = event.keyCode; // ASCII

			switch(key){
				case 97: //left 37/97
					if (sceneModels[0].tx > -0.75) sceneModels[0].tx -= 0.5;
					break;
				case 100: //right 39/100
					if (sceneModels[0].tx < 0.75) sceneModels[0].tx += 0.5;
					break;
				case 119: //up 38/119
					if (sceneModels[0].ty < 0.75) sceneModels[0].ty += 0.5;	
					break;
				case 115: //down 40/115
					if (sceneModels[0].ty > -0.75) sceneModels[0].ty -= 0.5;
					break;

				default:
					break;
				}

				drawScene()
			}
		}
		
	); 

	document.getElementById("my-canvas").addEventListener('click', e => {
		if(pauseMODE==0){
			var x = e.offsetX;
			var y = e.offsetY;
			sceneModels[0].tx = (parseInt(x/150) * 0.5)-0.75;
			sceneModels[0].ty = -(parseInt(y/150) * 0.5)+0.75;
		}
	});
	
	document.getElementById("Start-asteriode-movement").onclick = function(){
		document.getElementById("Start-asteriode-movement").style.display = "none";
		document.getElementById("Pause-asteriode-movement").style.display = "block";
		justStarted = 0;
		pauseMODE = 0;
		asteriodesMOVE_ON = 1;
	};

	document.getElementById("Pause-asteriode-movement").onclick = function(){
		document.getElementById("Pause-asteriode-movement").style.display = "none";
		document.getElementById("Restart-asteriode-movement").style.display = "block";
		document.getElementById("Resume-asteriode-movement").style.display = "block";
		asteriodesMOVE_ON = 0;
		pauseMODE = 1;
	};

	document.getElementById("Resume-asteriode-movement").onclick = function(){
		document.getElementById("Resume-asteriode-movement").style.display = "none";
		document.getElementById("Restart-asteriode-movement").style.display = "none";
		document.getElementById("Pause-asteriode-movement").style.display = "block";
		asteriodesMOVE_ON = 1;
		pauseMODE = 0;
	};

	document.getElementById("Restart-asteriode-movement").onclick = function(){
		document.getElementById("Restart-asteriode-movement").style.display = "none";
		document.getElementById("Resume-asteriode-movement").style.display = "none";
		document.getElementById("Pause-asteriode-movement").style.display = "block";
		document.getElementById("gameover").style.display = "none";
		pauseMODE = 0;
		score = 0;
		reset();
		asteriodesMOVE_ON = 1;
		lightSources[0].setPosition( -2.0, -2.0, -2.0, 0.0 );
		lightSources[1].setPosition( 5.0, 5.0, -50.0, 1.0 );
	};


}


//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );
		
		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );
        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	tick();		// A timer controls the rendering / animation    

	outputInfos();
}


