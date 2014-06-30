//
// Creates a wormhole via Tube Geometry
//
exports.wormhole = function( _3 ) {

	//define the wormhole geometry
	var path = [
		new _3.Vector3(   0,    0,  -70),
		new _3.Vector3(   0,    0,  -50),
		new _3.Vector3(   0,    0,  -30),
		new _3.Vector3(   0,    0,  -10),
		new _3.Vector3(   0,    0,    0),
		new _3.Vector3( -40,    0,   40),
		new _3.Vector3( -40,   40,   80),
		new _3.Vector3(  10,   80,  120),
		new _3.Vector3(  80,  120,  160),
		new _3.Vector3(   0,    0,  200),
		new _3.Vector3( -80,  -40,  240),
		new _3.Vector3(-120,  -80,  280),
		new _3.Vector3(-120, -120,  320),
		new _3.Vector3(   0,    0,  340),
		new _3.Vector3(   0,    0,  380),
		new _3.Vector3(   0,    0,  420),
		new _3.Vector3(   0,    0,  460),
		new _3.Vector3(   0,  -80,  500),
	];
																// Path, pathSegments, radius, radiusSegments, closed
	var geo = new _3.TubeGeometry(new _3.SplineCurve3(path), 64, 10, 64, false);
	var mat = new _3.MeshNormalMaterial({
		color : 0x33FF33,
		side  : _3.DoubleSide
	});

	var wormhole = new _3.Mesh(geo, mat);

	return wormhole;

}
