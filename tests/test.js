var style = document.createElement('style');

style.type = 'text/css';
style.appendChild(document.createTextNode("html,body {width: 100%; height: 100%} * { margin: 0; padding: 0 }"));
document.head.appendChild(style);

// initialize the canvas and return the WebGL graphics context
var THREE = require('three');

var scene = new THREE.Scene(),
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000),
		renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

document.body.appendChild(renderer.domElement);

var mesh = new THREE.Object3D();

var particles = new THREE.Geometry();
//var pTexture = THREE.ImageUtils.loadTexture('../models/star.gif');

for (var i = 0; i < 1000; i++) {
	var p = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
	//var p = new THREE.SphereGeometry(5);

	//p.position.x = Math.random() * 500 - 250;
	//p.position.y = Math.random() * 500 - 250;
	//p.position.z = Math.random() * 500 - 250;

	particles.vertices.push(p);
}

var particleMaterial = new THREE.ParticleBasicMaterial({color: 0xFFFFFF, size: 2});
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);

particleSystem.frustrumCulled = true;

mesh.add(particleSystem);

var bTexture = THREE.ImageUtils.loadTexture('../models/earth.jpg'),
		mTexture = THREE.ImageUtils.loadTexture('../models/moon.jpg');

var geometry = new THREE.SphereGeometry(100,100,100),
		material = new THREE.MeshPhongMaterial({map: bTexture}),
		sphere = new THREE.Mesh(geometry, material),
		pointLight = new THREE.PointLight(0xFFFFFF);

pointLight.position.x = 50;
pointLight.position.y = 50;
pointLight.position.z = 230;

var geo = new THREE.SphereGeometry(30, 100, 100),
		mat = new THREE.MeshPhongMaterial({map: mTexture, color: 0x808080}),
		moon = new THREE.Mesh(geo, mat);

moon.position.x = 250;
moon.position.z = 100;

mesh.add(pointLight);
mesh.add(moon);
mesh.add(sphere);

scene.add(mesh);

bTexture.needsUpdate = true;

camera.position.z = 220;

var draw = function() {

	requestAnimationFrame(draw);

	mesh.rotation.y += 0.002;
	moon.rotation.y += 0.01;
	sphere.rotation.y -= 0.01;
	renderer.render(scene, camera);
}

draw();
