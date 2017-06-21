var mouseX = 0, mouseY = 0,

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,

camera, scene, renderer, material, composer;

var flowerNull = null;

if ( ! Detector.webgl ){
	var imageUrl = 'static/img/background.png';
	$('body').css('background-image', 'url(' + imageUrl + ') ');
	$('body').css('background-size', 'contain');
	$('body').css('background-position', 'center');
	$('body').css('background-repeat', 'no-repeat');
}
else {
	init();
	animate();
}

function init() {

	var i, n_sub, container;
	var numPetals = 60;
	var cx = 0.0;
	var cz = 0.0;
	var cy = -20.0;
	var dontdraw = false;
	var flip = 100;

	var endV = []; //60
	var hiC = []; //60
	var lowC = []; //60

	//--------------------------------

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 800;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	renderer.autoClear = false;

	function radians (a) {
		return a/180.0*3.14159;
	}

	//fill endV
	for (var i = 0; i < numPetals; i++) {
		var a = (i ) * 360 / numPetals;
		var angle = radians(a);
		var modNum = 30;
		//var modAngle = radians((Math.floor(a / modNum) + .5) * modNum)
		var modAngle = radians(((a % modNum) + 0) * 360.0 / modNum)
		
		var x = cx + Math.cos(modAngle) * 170; //DO RADIAN MATH
		var y = -50.0;
		var z = cz + Math.sin(modAngle) * 170;
		endV[i] = new THREE.Vector3(x, y, z);
	}

	////fill hiC
	for (var i = 0; i < numPetals; i++) {
		var a = i*6;
		var angle = radians(a);
		var x = cx + Math.cos(angle) * 120;
		var y = -120.0;
		var z = cz + Math.sin(angle) * 120;
		hiC[i] = new THREE.Vector3(x, y, z);
	}

	//fill lowC
	for (var i = 0; i < numPetals; i++) {
		var a = i*6;
		var angle = radians(a);
		var x = cx + Math.cos(angle) * 100;
		var y = 11.2;
		var z = cz + Math.sin(angle) * 100;
		lowC[i] = new THREE.Vector3(x, y, z);
	}

    //stem
	var curve = new THREE.CubicBezierCurve3(
		new THREE.Vector3( cx, cy, cz),
		new THREE.Vector3( cx, cy+70, cz),
		new THREE.Vector3( cx-30, cy+130, cz+40),
		new THREE.Vector3( cx-60, cy+250, cz-40)
	);

	var geometry = new THREE.Geometry();
	geometry.vertices = curve.getPoints( 50 ); //resolution

	var material = new THREE.LineBasicMaterial( { color : 0xffffff } );

	// Create the final object to add to the scene
	var curveObject = new THREE.Line( geometry, material );
	curveObject.position.y = 40;

	flowerNull = new THREE.Group();
	flowerPetalsNull = new THREE.Group();
	flowerNull.add(curveObject);
	curveObject.rotation.x = 3.14159;
	curveObject.rotation.z = -.52;

	scene.add(flowerNull);

	//petals
  	for (var i = 0; i < 60; i++) {
	    var flip = (i) % 5;
	    if (flip == 0) {
	      dontdraw = !dontdraw;
	    };

    	if (!dontdraw) {
		    var petalCurve = new THREE.CubicBezierCurve3(
		    	new THREE.Vector3(cx, cy, cz), 
		        new THREE.Vector3(hiC[i].x, hiC[i].y, hiC[i].z), 
		        new THREE.Vector3(lowC[i].x, lowC[i].y, lowC[i].z), 
		        new THREE.Vector3(endV[i].x, endV[i].y, endV[i].z)
		    );
	  		var petalGeometry = new THREE.Geometry();
			petalGeometry.vertices = petalCurve.getPoints( 50 ); //resolution

			// Create the final object to add to the scene
			var petalCurveObject = new THREE.Line( petalGeometry, material );
			//petalCurveObject.position.y = -100;
	    	flowerPetalsNull.add(petalCurveObject);
	    }
	}
	flowerPetalsNull.scale.set(.8, .8, .8);
	curveObject.add(flowerPetalsNull);

	var renderModel = new THREE.RenderPass( scene, camera );
	var effectFilm = new THREE.FilmPass( .5, 0.95, 256, false );
	effectFilm.renderToScreen = true;
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( renderModel );
	composer.addPass( effectFilm );

	stats = new Stats();
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length > 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	camera.lookAt( scene.position );

	var time = Date.now() * 0.0005;

	flowerNull.rotation.y = time * .5;


	renderer.setRenderTarget( null );
	renderer.clear();
	composer.render( 0.01 );

}