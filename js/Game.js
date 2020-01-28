(function(window){

// Constructor :
	function Game() {
		this.initialize();
	};

//static const
	Math.degToRad = 180/Math.PI;
	Math.radToDeg = Math.PI/180;

// private vars
	var _canvas;
	var _map;


	var mouseTarget;	// the display object currently under the mouse, or being dragged
	var dragStarted;	// indicates whether we are currently in a drag operation
	var offset = new createjs.Point();
	var update = true;

	var Towers = new Array();
	var Enemies = new Array();
	var Bullets = new Array();

	var bounds;
	var quad;
	var that;
	var enemyQueue = new Array();
	var scoreLabel;
	var fpsText = new createjs.Text("0 fps", "bold 20px Arial", "#000");

	var currentInterval = 0;
	var interval = 0;

/**
 *
 *
 *		PUBLIC PROPERTIES
 *
 *
 */
	Game.prototype.level;
 	Game.prototype.stage;
	Game.prototype.wave;
	Game.prototype.money = 100;

/**
 *
 *
 *		PUBLIC METHODS
 *
 *
 */

	Game.prototype.initialize = function(){
		_canvas = document.getElementById("canvas");
		var mapCanvas = document.getElementById("map");
		stage = new createjs.Stage(_canvas);
		stage.enableMouseOver(10);
		createjs.Touch.enable(stage);

		level = new Level(1, "map.xml");
    	// draw map
		level.map.draw(mapCanvas.getContext("2d"));

		that = this;

    	// QuadTree - Colision detection
    	bounds = {
			x:0,
			y:0,
			width:_canvas.width,
			height:_canvas.height
		};

		quad = new QuadTree(bounds);
		
		fpsText.x = 10;
		fpsText.y = 20;

        createjs.Ticker.addEventListener("tick", this.tick);
		createjs.Ticker.useRAF = true;
		// 50 fps
		createjs.Ticker.interval = 20;
        this.initScore();
	};


	Game.prototype.run = function() {
		that.nextWave();
	};


	Game.prototype.nextWave = function(){
		wave = level.nextWave();
		if(!wave)return;
		interval = 30; // frames
		enemyQueue.push({"count":wave.enemyCount, "wave":wave});
		// for (var i =0; i<wave.enemyCount ; i++) {
		// 	var myTween = Tween.get(this)
		// 					.wait(1000*i)
		// 					.call(this.addEnemy);
		// }	
	};


	Game.prototype.addEnemy = function(wave){
		var enmi = new Enemy(level.map,wave.enemySpeed,wave.enemyHealth);
		Enemies.push(enmi);
		stage.addChild(enmi);
	};

	
	Game.prototype.addTower = function(){
		var tower = new Tower();
	  	tower.ghost(true);

		if(tower.cost>this.money){
			console.log("no money");
			return;
		};
		
	  	stage.addChild(tower);

	  	var mousemoveListener = stage.on("stagemousemove", function(e){
			var ymouse = (2*e.stageY-e.stageX)/2;
			var xmouse = e.stageX+ymouse;
			var y=Math.round(ymouse/30);
			var x=Math.round(xmouse/30)-1;

			tower.x = (x-y)*30+Map.ISO_WIDTH;
			tower.y = (x+y)*15+Map.ISO_HEIGHT;
	    });

	    stage.on("stagemouseup",function (event) {
	    	if(level.map.isBuildable(tower.x,tower.y)){
	    		Towers.push(tower);
	    		tower.ghost(false);
	    		stage.off("stagemousemove",mousemoveListener);
	    		event.remove();
	    		that.money -= tower.cost;
	    		that.updateScore();
	    	};
	    });
	};






Game.prototype.tick = function(){

	if(enemyQueue.length){
		that.runQueue();
	};

	if(Enemies.length){
		turretLoop();
		enemyLoop();
	};
	
	// deplacements
	if(Bullets.length){
		bulletLoop();
	};

	that.updateScore();

   	stage.update();

	fpsText.text = (createjs.Ticker.getMeasuredFPS()>> 0)+"fps";
	stage.addChild(fpsText);
};


	function bulletLoop(){
		for (var i = Bullets.length - 1; i >= 0; i--) {
			Bullets[i].tick();
			removeBullets(Bullets[i],i);
		};
	}

	function removeBullets(bullet,i){
		if(bullet.isDie){
			Bullets.splice(i, 1);
			stage.removeChild(bullet);
		};
	};



Game.prototype.runQueue = function(){
	var cleanQueue, count;
	var e = enemyQueue.length;
	for(var i =0; i<e;i++){
		count = enemyQueue[i].count;
		if(count){
			currentInterval ++;
			if (currentInterval > interval){
				currentInterval = 0;
				enemyQueue[i].count --;
				this.addEnemy(enemyQueue[i].wave);
			};
		}else{
			enemyQueue[i] = null;
			cleanQueue = true;
		};
	};
	if(cleanQueue){
		this.sortQueue();
		cleanQueue = false;
	};
};

Game.prototype.sortQueue = function(){
	var queue = enemyQueue.length;
	for(var j = queue-1; j>=0; j--) {
		if(enemyQueue[j] == null)
			enemyQueue.splice(j,1); 
	};
};

Game.prototype.initScore = function(){
	scoreLabel = new createjs.Text("$"+that.money, "bold 20px Arial", "#000");
	scoreLabel.x = 10;
	scoreLabel.y = 40;
	stage.addChild(scoreLabel);
};

Game.prototype.updateScore = function(){
	scoreLabel.text = "$"+that.money;
};

/**
 *
 *
 *		PRIVATE METHODS
 *
 *
 */
	function enemyLoop(){
		for (var i = Enemies.length - 1; i >= 0; i--) {
			Enemies[i].tick();
	    	testColision(Enemies[i]);
	    	removeEnemies(Enemies[i],i);
	    }
	}
	function removeEnemies(enemy,i){
		if(enemy.isDie){
			Enemies.splice(i, 1);
			stage.removeChild(enemy);
		};
	};

	function testColision(enemy){
		var bullet,items;
	
		// tableau de colision
		quad.clear();
		quad.insert(Bullets);
		items = quad.retrieve(enemy);

		if(!items.length) return;				
										//	console.log("## items:"+items.length+" - Bullets:"+Bullets.length)
		var itemLength = items.length;
		for (var i=0; i < itemLength; i++) {
			bullet = items[i];
			if(hitRadius(enemy,bullet)){
				bullet.explode();
				// retire point de vie
				enemy.touche(bullet.damage);
			};
			
		};

		if(enemy.isKilled){
			that.money += enemy.price;
			enemy.explode();
		};

	};
	


	// distance entre deux objets
 	function hitRadius(o1,o2) {
 		var _bound = o2.bound+o1.bound,
 			x1 = o1.x,
 			y1 = o1.y,
 			x2 = o2.x,
 			y2 = o2.y;
		//early returns speed it up - box colision
		if (x1 > x2 + _bound) { return; };
		if (x1 < x2 - _bound) { return; };
		if (y1 > y2 + _bound) { return; };
		if (y1 < y2 - _bound) { return; };

		//now do the circle distance test - circle colision
		return  Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2)) < _bound;
	};

	function addBullet(turret, enemy){
	 	var angle = Math.atan2(enemy.y - turret.y, enemy.x - turret.x) / Math.PI * 180;
	    var bullet = new Bullet(angle,turret.damage);
	        bullet.x = turret.x + Math.cos(angle * Math.radToDeg) * 20;
	        bullet.y = turret.y + Math.sin(angle * Math.radToDeg) * 20;

	    turret.bitmap.rotation = angle;
	    Bullets.push(bullet);
	    stage.addChild(bullet);
	};


	function turretLoop(){
		var towersLength = Towers.length;
		for (var i =0; i < towersLength; i++) {
			Towers[i].tick();
			towersShoot(Towers[i]);
		}
	}
	function towersShoot(turret){
		if(turret.isShooting)return;

		var enemyLength = Enemies.length;
		for (var i=0; i < enemyLength; i++) {
			enemy = Enemies[i];
			// enemy dans range ? shoot
			if(hitRadius(turret,enemy)){
				turret.shoot();
				addBullet(turret,enemy);
				break;
			};
		};
    };


	window.Game = Game;

})(window);