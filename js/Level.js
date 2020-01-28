(function(window){

function Level(lvl,mapURL){
	this.map = new Map(mapURL);
	this.map.init();
}

Level.prototype.map;

Level.prototype.currentWave = -1;

Level.prototype.nextWave = function(){
	if(this.currentWave<Waves.length-1){
		this.currentWave++;
	}
	return Waves[this.currentWave];
}

Level.prototype.getWave = function(){
	return Waves[this.currentWave];
}

var Waves = [
				{ "enemyCount":3, "enemyHealth":3, "enemySpeed":1 },
				{ "enemyCount":6, "enemyHealth":6, "enemySpeed":1.5 },
				{ "enemyCount":9, "enemyHealth":9, "enemySpeed":2 },
				{ "enemyCount":12, "enemyHealth":12, "enemySpeed":2.5 },
				{ "enemyCount":15, "enemyHealth":15, "enemySpeed":3 },
				{ "enemyCount":18, "enemyHealth":18, "enemySpeed":3.5 }
			];

window.Level = Level;

})(window);

