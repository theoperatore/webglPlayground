// from an example at https://github.com/jeromeetienne/threex.planets/blob/master/threex.planets.js
function cloudShim() {

	// create destination canvas
	var canvasResult	= document.createElement('canvas');
	canvasResult.width	= 1024;
	canvasResult.height	= 512;
	var contextResult	= canvasResult.getContext('2d');

	// load earthcloudmap
	var imageMap	= new Image();
	imageMap.addEventListener("load", function() {

		// create dataMap ImageData for earthcloudmap
		var canvasMap	= document.createElement('canvas');
		canvasMap.width	= imageMap.width;
		canvasMap.height= imageMap.height;
		var contextMap	= canvasMap.getContext('2d');
		contextMap.drawImage(imageMap, 0, 0);
		var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

		// load earthcloudmaptrans
		var imageTrans	= new Image();
		imageTrans.addEventListener("load", function(){
			// create dataTrans ImageData for earthcloudmaptrans
			var canvasTrans		= document.createElement('canvas');
			canvasTrans.width	= imageTrans.width;
			canvasTrans.height	= imageTrans.height;
			var contextTrans	= canvasTrans.getContext('2d');
			contextTrans.drawImage(imageTrans, 0, 0);
			var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
			// merge dataMap + dataTrans into dataResult;
			var dataResult		= contextMap.createImageData(canvasMap.width, canvasMap.height);
			for(var y = 0, offset = 0; y < imageMap.height; y++){
				for(var x = 0; x < imageMap.width; x++, offset += 4){
					dataResult.data[offset+0]	= dataMap.data[offset+0];
					dataResult.data[offset+1]	= dataMap.data[offset+1];
					dataResult.data[offset+2]	= dataMap.data[offset+2];
					dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0];
				}
			}
			// update texture with result
			contextResult.putImageData(dataResult,0,0);
			material.map.needsUpdate = true;;
		})
		imageTrans.src	= '../models/solar/earthcloudmaptrans.jpg';
	}, false);
	imageMap.src	= '../models/solar/earthcloudmap.jpg';

	var geometry	= new THREE.SphereGeometry(0.51, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
		map		: new THREE.Texture(canvasResult),
		side		: THREE.DoubleSide,
		transparent	: true,
		opacity		: 0.8,
	})
	var mesh	= new THREE.Mesh(geometry, material);
	return mesh;
}

var mouse = {x : 0, y : 0};
var style = document.createElement('style');

style.type = 'text/css';
style.appendChild(document.createTextNode("html,body {width: 100%; height: 100%} * { margin: 0; padding: 0 }"));
document.head.appendChild(style);

// initialize the canvas and return the WebGL graphics context
var THREE = require('three');

var scene = new THREE.Scene(),
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000),
		renderer = new THREE.WebGLRenderer();

camera.position.z = 1;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
renderer.shadowMapEnabled = true;

document.body.appendChild(renderer.domElement);

//add light
var light	= new THREE.AmbientLight( 0x222222 );
scene.add( light );

var light	= new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set(5,5,5);
scene.add( light );
light.castShadow	= true;
light.shadowCameraNear	= 0.01;
light.shadowCameraFar	= 15;
light.shadowCameraFov	= 45;

light.shadowCameraLeft	= -1;
light.shadowCameraRight	=  1;
light.shadowCameraTop	=  1;
light.shadowCameraBottom= -1;
// light.shadowCameraVisible	= true;

light.shadowBias	= 0.001;
light.shadowDarkness	= 0.2;

light.shadowMapWidth	= 1024;
light.shadowMapHeight	= 1024;

var earth_container = new THREE.Object3D();

earth_container.position.z = 0;
//earth_container.rotateOnAxis('z', -23.4 * Math.PI/180);

//create earth
var geometry = new THREE.SphereGeometry(0.5, 32, 32);
var material = new THREE.MeshPhongMaterial();

material.map     = THREE.ImageUtils.loadTexture('../models/solar/earthmap1k.jpg');
material.bumpMap = THREE.ImageUtils.loadTexture('../models/solar/earthbump1k.jpg');
material.specularMap = THREE.ImageUtils.loadTexture('../models/solar/earthspec1k.jpg');
material.speular = new THREE.Color('grey');
material.bumpScale = 0.05;

var earth = new THREE.Mesh(geometry, material);
earth.castShadow = true;
earth.receiveShadow = true;

earth_container.add(earth);

var cloudMesh = cloudShim();
cloudMesh.receiveShadow = true;
cloudMesh.castShadow = true;

earth_container.add(cloudMesh);

//create the moon!
var moonGeo = new THREE.SphereGeometry(0.1, 32, 32);
var moonMat = new THREE.MeshPhongMaterial({
	map :     THREE.ImageUtils.loadTexture('../models/solar/moonmap1k.jpg')
	//bumpMap : THREE.ImageUtils.loadTexture('../models/solar/moonbump1k.jpg'),
	//bumpScale : 0.05
});
var moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.x = 0.5;
moon.position.y = 0.5;
moon.position.z = 0.5;

moon.castShadow = true;
moon.receiveShadow = true;

earth_container.add(moon);

//create starfield
var starGeo = new THREE.SphereGeometry(90, 32, 32);
var starMat = new THREE.MeshBasicMaterial({
	map  : THREE.ImageUtils.loadTexture('../models/solar/galaxy_starfield.png'),
	side : THREE.BackSide
});
var starMesh = new THREE.Mesh(starGeo, starMat);

scene.add(starMesh);
scene.add(earth_container);

//scene.add(earth);
//scene.add(starMesh);

function animate() {
	requestAnimationFrame(animate);

	earth.rotation.y += 0.002;
	cloudMesh.rotation.y -= 0.001;
	moon.rotation.y += 0.002;

	renderer.render(scene, camera);
}

//add mouse movement controls
document.addEventListener('mousemove', function(ev) {
	mouse.x	= (ev.clientX / window.innerWidth ) - 0.5;
	mouse.y	= -(ev.clientY / window.innerHeight) + 0.5;

	camera.position.x += mouse.x*6 - camera.position.x * 1;
	camera.position.y += mouse.y*5 - camera.position.y * 1;

	camera.lookAt(scene.position);
});

animate();
