//
// Initializes some style and returns a Three.js object
//
exports.init = function() {

	var style = document.createElement('style');

	style.type = 'text/css';
	style.appendChild(document.createTextNode("html,body {width: 100%; height: 100%} * { margin: 0; padding: 0 }"));
	document.head.appendChild(style);

	var three = require('three'),
			tween = require('tween.js');

	//return an engine object with default webGL properties
	return {
		THREE    : three,
		renderer : new three.WebGLRenderer(),
		camera   : new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000),
		scene    : new three.Scene(),
		TWEEN    : tween
	};

};
