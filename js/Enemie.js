(function(window){
	/**
	 *
	 *
	 *
	 */
	
	var _map = null;
	
	function Enemy(map,speed,health) {
		_map = map;

		

		this.initialize(speed,health);
	}

	

	Enemy.prototype = new createjs.Container();
	Enemy.prototype.bar = null;
	Enemy.prototype.bitmap = null;
	Enemy.prototype.health = 0;
	Enemy.prototype.maxHealth = 0;
	Enemy.prototype.point_to_reach = 0;
	Enemy.prototype.speed = 0;
	Enemy.prototype.isKilled = false;
	Enemy.prototype.text = null;
	Enemy.prototype.healthBar = null;
	Enemy.prototype.bound = 10;

	Enemy.prototype.cible_x = 0;
	Enemy.prototype.cible_y = 0;
	Enemy.prototype.angle = 0;
	Enemy.prototype.dist_x = 0;
	Enemy.prototype.dist_y = 0;
	Enemy.prototype.price = 5;
	
	Enemy.prototype.cos = 0;
	Enemy.prototype.sin = 0;
	Enemy.prototype.isDie = false;

// Constructor:
	Enemy.prototype.Container_initialize = Enemy.prototype.initialize;

	Enemy.prototype.initialize = function(speed,health){
		this.Container_initialize();
		
		this.bar = new createjs.Shape();

		this.bitmap = new createjs.Bitmap("images/enemy.png");
		this.bitmap.x = -Map.ISO_WIDTH;
		this.bitmap.y = -Map.ISO_HEIGHT;
		this.bitmap.regY = 30;

		
		var g = this.bar.graphics;
		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,0,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,0));
	    g.drawRect(-20,-Map.TILE_HEIGHT-3,20,3);

		this.healthBar = new createjs.Shape();
		var g2 = this.healthBar.graphics;
		g2.setStrokeStyle(1);
		g2.beginStroke(createjs.Graphics.getRGB(0,0,0));
		g2.beginFill(createjs.Graphics.getRGB(0,255,0));
	    g2.drawRect(-20,-Map.TILE_HEIGHT-3,20,3);

		console.log("init");
		this.speed = speed;
		this.health = health;
		this.maxHealth = health;

		this.addChild(this.bitmap, this.bar);
		this.addChild(this.healthBar);
		
		//*** Health en txt chiffre
		// this.txt = new Text(this.health, "bold 10px Arial", "#fff");
		// this.txt.textAlign = "center";
		// this.txt.x =  Map.ISO_HEIGHT;
		// this.txt.y = -Map.ISO_HEIGHT;

		//*** Dessine cercle position
		// var o = new Shape();
		// 	g = o.graphics;
		// 	g.beginFill(Graphics.getRGB(255,0,0));
		//     g.drawCircle(0,0,2);
		// o.scaleY = 0.5;
		// this.addChild(o);

		// var c = new Shape();
		// 	g = c.graphics;
		// 	g.beginFill(Graphics.getRGB(155,0,0,0.2));
		//     g.drawCircle(0,0,10);
		// c.scaleY = 0.5;
		// this.addChild(c);


		this.getCible();

		this.x = this.cible_x;
		this.y = this.cible_y;

		this.computeVars();

		//this.cache(-30,-45,60,75);
	}

Enemy.prototype.getCible = function(){
	var pX = _map.waypoint_x[this.point_to_reach];
	var pY = _map.waypoint_y[this.point_to_reach];

	this.cible_x = pX * Map.ISO_WIDTH + pY*Map.ISO_WIDTH + Map.ISO_WIDTH;
	this.cible_y = pY * Map.ISO_HEIGHT + 300 + pX * -Map.ISO_HEIGHT +Map.ISO_HEIGHT;
}

Enemy.prototype.computeVars = function(){
	this.dist_x = this.cible_x-this.x;
	this.dist_y = this.cible_y-this.y;
	this.angle = Math.atan2(this.dist_y, this.dist_x);
	this.cos = Math.cos(this.angle);
	this.sin = Math.sin(this.angle);
}

Enemy.prototype.distance = function(){
	return Math.sqrt(Math.pow(this.dist_x,2)+Math.pow(this.dist_y,2))
}

	Enemy.prototype.tick = function() {
		if (this.distance()<this.speed) {
			
			this.x = this.cible_x;
			this.y = this.cible_y;
			
			this.point_to_reach++;

			this.getCible();
			this.computeVars();
			return;
		}
		 
		this.x += this.speed*this.cos;
		this.y += this.speed*this.sin;

		this.dist_x = this.cible_x-this.x;
		this.dist_y = this.cible_y-this.y;
		// TODO rotation set sprite
		// this.rotation = angle*Math.degToRad;

		this.isDie = this.isOutOfScreen();
	}

	// On teste les bords de l’écran  TODO var width height
	Enemy.prototype.isOutOfScreen = function(){
		if (this.x >= 800 || this.x < 0 || this.y >= 600 || this.y < 0) {
		    return true;
		}
	}

    Enemy.prototype.hitRadius = function (tX, tY) {
        //early returns speed it up
        if (tX - 15 > this.x + 30) { return; }
        if (tX + 15 < this.x - 30) { return; }
        if (tY - 15 > this.y + 30) { return; }
        if (tY + 15 < this.y - 30) { return; }

        //now do the circle distance test
        return 45 > Math.sqrt(Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2));
    }

    Enemy.prototype.touche = function(degat){
    	this.health -= degat;
    	//this.txt.text = this.health;
    	if(this.health<1){
			this.health = 0;
    		this.isKilled = true;
    	}
		var barWidth = this.health/this.maxHealth;
    	this.healthBar.scaleX = barWidth;
    }

    // remplace par anim sprite
    Enemy.prototype.explode = function(){
		this.isDie = true;
    	// var myTween = createjs.Tween.get(this)
		// 					.call(function(){this.isDie = true;});
	}




    window.Enemy = Enemy;

})(window);

