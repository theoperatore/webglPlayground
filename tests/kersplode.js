var engine = require('../scripts/engine').init(),
		kersplode = false,
		kersploded = false,
		inputs = {
			'left'  : false,
			'right' : false,
			'up'    : false,
			'down'  : false
		},
		dt = 0,
		now = performance.now() || +new Date(),
		prev = now,
		anim;

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
// Mouse kersplode Stuff
//
document.addEventListener('click', function(ev) {
	kersplode = true;
},false);

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

//
// Special Vars
//
var particles = new engine.THREE.Geometry(),
		p_color = 0xFFFFFF,
		p_size = 4,
		p_texture = engine.THREE.ImageUtils.loadTexture('./models/particle.png'),
		particleSystem,
		particleMaterial,
		numParticles = 7777;

//
// Setup particle system
//
for (var i = 0; i < numParticles; i++) {
	var tmp = new engine.THREE.Vector3(0,0,0);
	tmp.dynamic = true;
	particles.vertices.push(tmp);
}

particleMaterial = new engine.THREE.ParticleSystemMaterial({
	color       : p_color,
	size        : p_size,
	map         : p_texture || '',
	blending    : engine.THREE.AdditiveBlending,
	transparent : true
});
particleSystem = new engine.THREE.ParticleSystem(particles, particleMaterial);
particleSystem.sortParticles = true;
particleSystem.dynamic = true;

engine.scene.add(particleSystem);

//
// setup kersplode tweens and random colors
//
for (var i = 0; i < particles.vertices.length; i++) {
	var particle = particles.vertices[i];
	var color = new engine.THREE.Color(0xFFFFFF);

	color.setRGB(Math.random(), Math.random(), Math.random());

	particles.colors.push(color);

	particle.k_tween = new engine.TWEEN.Tween(particle)
		.to(
			{
				x : Math.random() * 1200 - 600,
				y : Math.random() * 1200 - 600,
				z : Math.random() * 1200 - 600
			}, 1200)
		//.repeat(1)
		//.yoyo(true)
		.easing(engine.TWEEN.Easing.Exponential.InOut);
}

particles.dynamic = true;

//
// update and draw
//
function update(time) {
	anim = requestAnimationFrame(update);

	//unused
	//now = time;
	//dt = now - prev;
	//prev = now;

	var count = particles.vertices.length;
	for (var i = 0; i < count; i++) {
		var particle = particles.vertices[i];

		//this takes forever
		if (kersplode) {
			particle.k_tween.start();
			kersploded = true;
		}
		else if (kersploded){
			particle.z += 1;
		}

		if (particle.z >= (150 + engine.camera.position.z)) {
			particle.z = 50;
		}
	}

	kersplode = false;
	particles.verticesNeedUpdate = true;
	particles.colorsNeedUpdate = true;

	//do camera changing stuff
	if (inputs['left']) {
		engine.camera.rotation.y += 0.015;
	}
	else if (inputs['right']) {
		engine.camera.rotation.y -= 0.015;
	}
	else if (inputs['up']) {
		//particleSystem.position.z -= 1;
		//engine.camera.position.z -= 1;
	}
	else if (inputs['down']) {
		//particleSystem.position.z += 1;
		//engine.camera.position.z += 1;
	}

	engine.TWEEN.update();
	engine.renderer.render(engine.scene, engine.camera);
}

anim = requestAnimationFrame(update);
