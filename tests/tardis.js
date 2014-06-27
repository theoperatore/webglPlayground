var engine = require('../scripts/engine').init(),
		p_sys  = require('../scripts/particleField').createField(engine.THREE, engine.TWEEN, 7777),
		inputs = {
			'left'  : false,
			'right' : false,
			'up'    : false,
			'down'  : false,
			'kersplode'  : false,
			'kersploded' : false,
			'tardis_tweened' : false
		};

//
// Setup renderer
//
engine.renderer.setSize(window.innerWidth, window.innerHeight);
engine.renderer.setClearColor(0x000000, 1);

document.body.appendChild(engine.renderer.domElement);

engine.camera.position.z = 400;

var light = new engine.THREE.AmbientLight(0xffffff);
engine.scene.add(light);

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
// Load the Tardis!
//
var loader = new engine.THREE.JSONLoader();
var tardis = null;

//console.log(loader.load, loader);
loader.load('./models/TARDIS/tardis.js', function(geo, mats) {


	var tardis_mats = new engine.THREE.MeshFaceMaterial(mats);
	tardis = new engine.THREE.Mesh(geo, tardis_mats);

	tardis.position.z = 390;
	tardis.position.y = -3;
	tardis.position.x = 3;

	tardis.rotation.x = Math.PI / 4;
	tardis.rotSpeed = 0.1;

	tardis.tween = new engine.TWEEN.Tween({x : tardis.rotation.x, rotSpeed : tardis.rotSpeed})
																  .to({x : 0, rotSpeed : 0.01}, 1200)
																	.onUpdate(function() {
																		tardis.rotation.x = this.x;
																		tardis.rotSpeed   = this.rotSpeed;
																	})
																	.easing(engine.TWEEN.Easing.Exponential.InOut);

	engine.scene.add(tardis);
});

//
// Add Particle System to scene
//
engine.scene.add(p_sys);

//
// Update scene
//
function update(time) {
	requestAnimationFrame(update);

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

	//update particles
	for (var i = 0; i < p_sys.geometry.vertices.length; i++) {

		var p = p_sys.geometry.vertices[i];

		if (inputs['kersplode']) { p.tween.start(); inputs['kersploded'] = true; }
		if (inputs['kersploded']) { p.z += 1; }
		if (p.z >= (150 + engine.camera.position.z)) { p.z = 0; }

	}

	p_sys.geometry.verticesNeedUpdate = true;
	inputs['kersplode'] = false;

	//rotate the tardis
	if (tardis) {
		if (inputs['kersploded'] && !inputs['tardis_tweened']) {

			tardis.tween.start();
			inputs['tardis_tweened'] = true;
		}
		tardis.rotation.y += tardis.rotSpeed;
	}


	//update tweens and draw
	engine.TWEEN.update();
	engine.renderer.render(engine.scene, engine.camera);
}



requestAnimationFrame(update);
