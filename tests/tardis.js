var engine = require('../scripts/engine').init(),
		p_sys  = require('../scripts/particleField').createField(engine.THREE, engine.TWEEN, 7777),
		wormhole = require('../scripts/wormhole.js').wormhole(engine.THREE),
		inputs = {
			'left'  : false,
			'right' : false,
			'up'    : false,
			'down'  : false,
			'kersplode'  : false,
			'kersploded' : false,
			'tardis_tweened' : false
		},

		dt = 0,
		now = performance.now() || +new Date(),
		prev = now;

//
// Setup renderer
//
engine.renderer.setSize(window.innerWidth, window.innerHeight);
engine.renderer.setClearColor(0x000000, 1);
document.body.appendChild(engine.renderer.domElement);

engine.camera.position.z = 400;



//add light to scene
var light = new engine.THREE.AmbientLight(0xffffff);
engine.scene.add(light);

//
// Load the Tardis!
//
var loader = new engine.THREE.JSONLoader();
var tardis = null;

loader.load('./models/TARDIS/tardis.js', function(geo, mats) {


	var tardis_mats = new engine.THREE.MeshFaceMaterial(mats);
	tardis = new engine.THREE.Mesh(geo, tardis_mats);

	tardis.position.z = 0;
	tardis.position.y = -3;
	tardis.position.x = 3;

	tardis.rotation.x = 3 * Math.PI / 2;
	tardis.rotSpeed = 0.1;

	tardis.tween = new engine.TWEEN.Tween({x : tardis.rotation.x, rotSpeed : tardis.rotSpeed})
																  .to({x : 0, rotSpeed : 0.01}, 1200)
																	.onUpdate(function() {
																		tardis.rotation.x = this.x;
																		tardis.rotSpeed   = this.rotSpeed;
																	});

	engine.scene.add(tardis);

});

//
// wormhole test?
//
var container = new engine.THREE.Object3D();
container.add(wormhole);
engine.scene.add(container);


//
// Add Particle System to scene
//
//engine.scene.add(p_sys);

//
// Keyboard camera stuff
//
document.addEventListener('keydown', function(ev) {
	//left
	if (ev.keyCode === 65) {
		inputs['left'] = true;
	}

	//right
	else if(ev.keyCode === 68) {
		inputs['right'] = true;
	}

	//up
	else if(ev.keyCode === 87) {
		inputs['up'] = true;
	}

	//down
	else if(ev.keyCode === 83) {
		inputs['down'] = true;
	}

	//stop everything
	else if (ev.keyCode === 27) {
		cancelAnimationFrame(anim);
	}
},false);

document.addEventListener('keyup', function(ev) {
	//left
	if (ev.keyCode === 65) {
		inputs['left'] = false;
	}

	//right
	else if(ev.keyCode === 68) {
		inputs['right'] = false;
	}

	//up
	else if(ev.keyCode === 87) {
		inputs['up'] = false;
	}

	//down
	else if(ev.keyCode === 83) {
		inputs['down'] = false;
	}
},false);

document.addEventListener('click', function(ev) { inputs['kersplode'] = true; });

//
// Update scene
//
function update(time) {
	requestAnimationFrame(update);

	now = time;
	dt = now - prev;
	prev = now;

	//handle inputs
	if (inputs['left']) {
		engine.camera.rotation.y += 0.015;
	}
	else if (inputs['right']) {
		engine.camera.rotation.y -= 0.015;
	}
	else if (inputs['up']) {
		engine.camera.position.z -= 1;
	}
	else if (inputs['down']) {
		engine.camera.position.z += 1;
	}

	/*
	//update particles
	for (var i = 0; i < p_sys.geometry.vertices.length; i++) {

		var p = p_sys.geometry.vertices[i];

		if (inputs['kersplode']) { p.tween.start(); inputs['kersploded'] = true; }
		if (inputs['kersploded']) { p.z += 1; }
		if (p.z >= (150 + engine.camera.position.z)) { p.z = 0; }

	}

	p_sys.geometry.verticesNeedUpdate = true;
	inputs['kersplode'] = false;

	/*
	//tardis logic
	if (tardis) {
		if (inputs['kersploded'] && !inputs['tardis_tweened']) {

			tardis.tween.start();
			inputs['tardis_tweened'] = true;
		}
		tardis.rotation.y += tardis.rotSpeed;
	}
	*/

	tardis.rotation.y += tardis.rotSpeed;

	//
	//Worm hole camera logic
	//
	var looptime = 20 * 1000;
	var t = ( now % looptime ) / looptime;
	var n_t = ( (now + (16 * 10)) % looptime) / looptime;
	var pos = wormhole.geometry.path.getPointAt( t );
	var n_pos = wormhole.geometry.path.getPointAt( n_t );

	// interpolation
	var segments = wormhole.geometry.tangents.length;
	var pickt = t * segments;
	var pick = Math.floor( pickt );
	var pickNext = ( pick + 1 ) % segments;

	var binormal = new engine.THREE.Vector3();
	binormal.subVectors( wormhole.geometry.binormals[ pickNext ], wormhole.geometry.binormals[ pick ] );
	binormal.multiplyScalar( pickt - pick ).add( wormhole.geometry.binormals[ pick ] );

	var dir = wormhole.geometry.path.getTangentAt( t );

	var normal = new engine.THREE.Vector3();
	normal.copy( binormal ).cross( dir );

	if (tardis) { tardis.position = n_pos; }

	engine.camera.position = pos;

	var lookAt = new engine.THREE.Vector3();
	lookAt.copy( pos ).add( dir );

	if (tardis) {
		tardis.matrix.lookAt(tardis.position, lookAt, normal);
		//tardis.rotation.setFromRotationMatrix(tardis.matrix, tardis.rotation.order);
	}

	engine.camera.matrix.lookAt(engine.camera.position, lookAt, normal);
	engine.camera.rotation.setFromRotationMatrix( engine.camera.matrix, engine.camera.rotation.order );


	//update tweens and draw
	engine.TWEEN.update();
	engine.renderer.render(engine.scene, engine.camera);
}


requestAnimationFrame(update);
