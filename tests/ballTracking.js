//
// Vars
//
var engine = require('../scripts/engine').init(),
		mouse = { x : 0, y : 0, changed : false, pos: null },
		anim,

		//update variables
		dt   = 0,
		now  = performance.now() || +new Date(),
		prev = now;

//
// Mouse movement event
//
document.addEventListener('mousemove', function(ev) {

	mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
	mouse.changed = true;

}, false);

//
// setup renderer and add to DOM
//
engine.renderer.setSize(window.innerWidth, window.innerHeight);
engine.renderer.setClearColor(0x000000, 1);
document.body.appendChild(engine.renderer.domElement);

//
// setup camera / add light?
//
//var light = new engine.THREE.AmbientLight(0xcccccc);
var point = new engine.THREE.PointLight(0xffffff);

point.position.x = 0;
point.position.y = 0;
point.position.z = 1;

engine.scene.add(point);
//engine.scene.add(light);

engine.camera.position.z = 1;

//
// Load pointer ball mesh and add to scene
//
var geometry = new engine.THREE.SphereGeometry(0.5, 32, 32);
var material = new engine.THREE.MeshPhongMaterial(
	{
		map : engine.THREE.ImageUtils.loadTexture('../models/moon.jpg')
	});
var ball = new engine.THREE.Mesh(geometry, material);

ball.position.y = 2;

engine.scene.add(ball);

//
// Load cat mesh and add to scene
//
//create starfield
var starGeo = new engine.THREE.SphereGeometry(90, 32, 32);
var starMat = new engine.THREE.MeshBasicMaterial({
	map  : engine.THREE.ImageUtils.loadTexture('../models/solar/galaxy_starfield.png'),
	side : engine.THREE.BackSide
});
var starMesh = new engine.THREE.Mesh(starGeo, starMat);

engine.scene.add(starMesh);

//
// Load cat paws and add to cat mesh
//

//
// Setup update loop
//
function update(time) {
	anim = requestAnimationFrame(update);

	//update dt
	now  = time;
	dt   = now - prev;
	prev = now;

	//TODO: update 'play' logic

	if (mouse.changed) {

		var vec   = new engine.THREE.Vector3(mouse.x, mouse.y, 0.5);
		var proj  = new engine.THREE.Projector();

		proj.unprojectVector(vec, engine.camera);

		var dir   = vec.sub(engine.camera.position).normalize();
		var dist  = -engine.camera.position.z / dir.z;
		mouse.pos = engine.camera.position.clone().add(dir.multiplyScalar(dist));
		mouse.changed = false;

		var pos = { x: ball.position.x, y: ball.position.y};
		var b_tween = new engine.TWEEN.Tween(pos).to({ x: mouse.pos.x, y: mouse.pos.y }, 1200);
		b_tween.onUpdate(function() {
			ball.position.x = pos.x;
			ball.position.y = pos.y;

		});
		b_tween.easing(engine.TWEEN.Easing.Quadratic.InOut);
		b_tween.start();


		//ball.position.x = mouse.pos.x;
	}

	engine.TWEEN.update();
	//do something cool with the ball
	ball.rotation.y += 0.01;

	//render the view
	engine.renderer.render(engine.scene, engine.camera);
}

//
// begin the things!
//
anim = requestAnimationFrame(update);
