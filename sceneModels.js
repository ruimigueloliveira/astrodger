//////////////////////////////////////////////////////////////////////////////
//
//  For instantiating the scene models.
//
//  J. Madeira - November 2018
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
//  Constructors
//


function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	this.textureCoords = [];

	this.vertexIndices = [];

	// Transformation parameters

	// Displacement vector
	
	this.tx = 0.0;
	
	this.ty = 0.0;
	
	this.tz = 0.0;	
	
	// Rotation angles	
	
	this.rotAngleXX = 0.0;
	
	this.rotAngleYY = 0.0;
	
	this.rotAngleZZ = 0.0;	

	// Scaling factors
	
	this.sx = 1.0;
	
	this.sy = 1.0;
	
	this.sz = 1.0;		
	
	// Animation controls
	
	this.rotXXOn = true;
	
	this.rotYYOn = true;
	
	this.rotZZOn = false;
	
	this.rotXXSpeed = 1.0;
	
	this.rotYYSpeed = 1.0;
	
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	
	this.rotYYDir = 1;
	
	this.rotZZDir = 1;
	
	// Material features
	
	this.kAmbi = [ 1, 1, 1 ];
	
	this.kDiff = [ 1, 1, 1 ];

	this.kSpec = [ 1, 1, 1 ];

	this.nPhong = 1000;

	// Control

	this.isActive = false;
}

function singleTriangleModel( ) {
	
	var triangle = new emptyModelFeatures();
	
	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE
		 
		-0.5, -0.5,  0.5,
		 
		 0.5, -0.5,  0.5,
		 
		 0.5,  0.5,  0.5,
	];

	triangle.normals = [

		// FRONTAL TRIANGLE
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
	];

	return triangle;
}


function simpleCubeModel( ) {
	
	var cube = new emptyModelFeatures();
	
	cube.vertices = [

		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000,  1.000000,  1.000000, 
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000, 	 
	];

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


function cubeModel(subdivisionDepth) {

	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, subdivisionDepth );
	
	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}


function simpleNaveModel( ) {
	
	var nave = new emptyModelFeatures();
	
	nave.vertices = [

		0,2,0,
		0,0,-4,
		-3,-1,2,

		0,2,0,
		3,-1,2,
		0,0,-4,

		0,2,0,
		-3,-1,2,
		3,-1,2,

		0,0,-4,
		3,-1,2,
		-3,-1,2,

		0,0,-4,
		3,-1,2,
		6,-2,4,

		0,0,-4,
		-6,-2,4,
		-3,-1,2,


		0,-1,2,
		6,-2,4,
		3,-1,2,

		0,-1,2,
		-3,-1,2,
		-6,-2,4,

		0,-1,2,
		0,0,-4,
		6,-2,4,

		0,-1,2,
		-6,-2,4,
		0,0,-4,

		0,4,4,
		-1,-1,2,
		1,-1,2,

		0,4,4,
		0,2,0,
		-1,-1,2,

		0,4,4,
		1,-1,2,
		0,2,0,

			 
	];

	computeVertexNormals( nave.vertices, nave.normals );

	return nave;
}


function naveModel(subdivisionDepth) {

	var nave = new simpleNaveModel();
	
	midPointRefinement( nave.vertices, subdivisionDepth );
	
	computeVertexNormals( nave.vertices, nave.normals );
	
	return nave;
}


function simpleTetrahedronModel( ) {
	
	var tetra = new emptyModelFeatures();
	
	tetra.vertices = [

		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];

	tetra.textureCoords = [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,

		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,

		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	];

	tetra.vertexIndices = [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,

		0.0, 1.0,
		0.0, 0.0,
		1.0, 0.0,

		1.0, 1.0,
		0.0, 1.0,
		0.0, 0.0,

		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	];

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}


function tetrahedronModel( subdivisionDepth = 0 ) {
	
 	var tetra = new simpleTetrahedronModel();
	
 	midPointRefinement( tetra.vertices, subdivisionDepth );
	
	computeVertexNormals( tetra.vertices, tetra.normals );
	
	return tetra;
}


function sphereModel(subdivisionDepth=1) {
	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices )
	
	computeVertexNormals( sphere.vertices, sphere.normals );
	
	return sphere;
}


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

// // Model 0 --- Top Left

// sceneModels.push( new singleTriangleModel() );

// sceneModels[0].tx = -0.5; sceneModels[0].ty = 0.5;

// sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.5;

// Model 1 --- Top Right

sceneModels.push( new simpleNaveModel() );

sceneModels[0].tx = -0.25; sceneModels[0].ty = -0.25;

sceneModels[0].sx = sceneModels[0].sy = sceneModels[0].sz = 0.05;

sceneModels[0].isActive = true;

sceneModels[0].rotXXOn = sceneModels[0].rotYYOn = false;

sceneModels[0].kDiff = [ 1, 0.2, 0.2 ];

// Model 2 --- Bottom Right

// sceneModels.push( new tetrahedronModel( 1 ) );

// sceneModels[2].tx = 0.5; sceneModels[2].ty = -0.5;

// sceneModels[2].sx = sceneModels[2].sy = sceneModels[2].sz = 0.25;

// // Model 3 --- Bottom Left

// sceneModels.push( new cubeModel( 1 ) );

// sceneModels[3].tx = -0.5; sceneModels[3].ty = -0.5;

// sceneModels[3].sx = 0.4; sceneModels[3].sy = sceneModels[3].sz = 0.25;

// // Model 4 --- Middle

// sceneModels.push( new simpleCubeModel() );

// sceneModels[4].sx = 0.1; sceneModels[4].sy = 0.75; sceneModels[4].sz = 0.1;

// // Model 5 --- Middle

// sceneModels.push( new sphereModel( 3 ) );

// sceneModels[5].sx = 0.25; sceneModels[5].sy = 0.25; sceneModels[5].sz = 0.25;


sceneModels.push(new sphereModel(1));
sceneModels[1].sx = 0.2; sceneModels[1].sy = 0.2; sceneModels[1].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[2].sx = 0.2; sceneModels[2].sy = 0.2; sceneModels[2].sz = 0.2;

sceneModels.push(new tetrahedronModel(1));
sceneModels[3].sx = 0.1; sceneModels[3].sy = 0.1; sceneModels[3].sz = 0.1;

sceneModels.push(new sphereModel(1));
sceneModels[4].sx = 0.2; sceneModels[4].sy = 0.2; sceneModels[4].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[5].sx = 0.2; sceneModels[5].sy = 0.2; sceneModels[5].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[6].sx = 0.2; sceneModels[6].sy = 0.2; sceneModels[6].sz = 0.2;

sceneModels.push(new tetrahedronModel(1));
sceneModels[7].sx = 0.1; sceneModels[7].sy = 0.1; sceneModels[7].sz = 0.1;

sceneModels.push(new sphereModel(1));
sceneModels[8].sx = 0.2; sceneModels[8].sy = 0.2; sceneModels[8].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[9].sx = 0.2; sceneModels[9].sy = 0.2; sceneModels[9].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[10].sx = 0.2; sceneModels[10].sy = 0.2; sceneModels[10].sz = 0.2;

sceneModels.push(new tetrahedronModel(1));
sceneModels[11].sx = 0.15; sceneModels[11].sy = 0.15; sceneModels[11].sz = 0.15;

sceneModels.push(new sphereModel(1));
sceneModels[12].sx = 0.2; sceneModels[12].sy = 0.2; sceneModels[12].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[13].sx = 0.2; sceneModels[13].sy = 0.2; sceneModels[13].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[14].sx = 0.2; sceneModels[14].sy = 0.2; sceneModels[14].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[15].sx = 0.2; sceneModels[15].sy = 0.2; sceneModels[15].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[16].sx = 0.2; sceneModels[16].sy = 0.2; sceneModels[16].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[17].sx = 0.2; sceneModels[17].sy = 0.2; sceneModels[17].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[18].sx = 0.2; sceneModels[18].sy = 0.2; sceneModels[18].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[19].sx = 0.2; sceneModels[19].sy = 0.2; sceneModels[19].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[20].sx = 0.2; sceneModels[20].sy = 0.2; sceneModels[20].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[21].sx = 0.2; sceneModels[21].sy = 0.2; sceneModels[21].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[22].sx = 0.2; sceneModels[22].sy = 0.2; sceneModels[22].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[23].sx = 0.2; sceneModels[23].sy = 0.2; sceneModels[23].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[24].sx = 0.2; sceneModels[24].sy = 0.2; sceneModels[24].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[25].sx = 0.2; sceneModels[25].sy = 0.2; sceneModels[25].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[26].sx = 0.2; sceneModels[26].sy = 0.2; sceneModels[26].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[27].sx = 0.2; sceneModels[27].sy = 0.2; sceneModels[27].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[28].sx = 0.2; sceneModels[28].sy = 0.2; sceneModels[28].sz = 0.2;

sceneModels.push(new sphereModel(1));
sceneModels[29].sx = 0.2; sceneModels[29].sy = 0.2; sceneModels[29].sz = 0.2;



