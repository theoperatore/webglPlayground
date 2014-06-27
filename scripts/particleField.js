exports.createField = function(THREE, TWEEN, count) {
	count = count || 7777;

	var p_geo = new THREE.Geometry(),
			p_mat = new THREE.ParticleSystemMaterial(),
			p_sys;

	for (var i = 0; i < count; i++) {
		var p = new THREE.Vector3(0,0,0);
		p.tween = new TWEEN.Tween(p)
								  .to({
										x : Math.random() * 1200 - 600,
										y : Math.random() * 1200 - 600,
										z : Math.random() * 1200 - 600
									}, 1200)
									//.repeat(1)
									//.yoyo(true)
									.easing(TWEEN.Easing.Exponential.InOut);

		p_geo.vertices.push(p);
	}

	p_mat.map  = THREE.ImageUtils.loadTexture('./models/particle.png');
	p_mat.size = 5;
	p_mat.transparent = true;
	p_mat.blending = THREE.AdditiveBlending;

	p_sys = new THREE.ParticleSystem(p_geo, p_mat);
	p_sys.sortParticles = true;
	p_sys.dynamic = true;

	return p_sys;
}
