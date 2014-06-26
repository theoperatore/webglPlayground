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
renderer.setClearColor(0xFFFFFF, 1);

document.body.appendChild(renderer.domElement);

camera.position.z = 100;

//start creating custom shapes
var capgeo = new THREE.SphereGeometry(25, 32, 32, Math.PI, Math.PI, Math.PI);
var capmat = new THREE.MeshPhongMaterial({color: 0xA8F433 });
var capmesh = new THREE.Mesh(capgeo, capmat);
capmesh.material.side = THREE.DoubleSide;

scene.add(capmesh);

var pointLight = new THREE.PointLight(0xFFFFFF);

pointLight.position.x = 50;
pointLight.position.y = 50;
pointLight.position.z = 80;

scene.add(pointLight);


//
// Draw
//
var draw = function() {

	requestAnimationFrame(draw);

	//capmesh.rotation.x += 0.002;
	capmesh.rotation.y += 0.01;
	//capmesh.rotation.z += 0.002;

	renderer.render(scene, camera);
}

draw();
