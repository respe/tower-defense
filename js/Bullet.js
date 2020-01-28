(function(window){

	function Bullet(angle,damage){	
		this.initialize(angle,damage);

		
	}
	var that;

	Bullet.prototype = new createjs.Shape();

// Public properties:
	
	Bullet.prototype.size = 2;
	Bullet.prototype.bound = 2; //rayon imapct
	Bullet.prototype.speed = 1;
	Bullet.prototype.angle = 0;
	Bullet.prototype.range = 120;
	Bullet.prototype.speed_x = 0;
	Bullet.prototype.speed_y = 0;

	Bullet.prototype.distance = 0;

	Bullet.prototype.damage = 5;
	Bullet.prototype.isDie = false;

// Constructor:
	Bullet.prototype.Container_initialize = Bullet.prototype.initialize;
	Bullet.prototype.initialize = function(angle,damage){
		//that.Container_initialize();
		

		var g = this.graphics;
			g.beginStroke(createjs.Graphics.getRGB(0,0,0));
			g.beginFill(createjs.Graphics.getRGB(255,0,0));
		    g.drawCircle(0,0,this.size);
		    
		this.damage = damage;
		this.angle = angle;

		this.setSpeed(this.speed);

		this.cache ( -this.size , -this.size , this.size*2 , this.size*2 )
	}

	Bullet.prototype.setSpeed = function(speed){
		this.speed = speed;
		this.speed_x = Math.cos(this.angle * Math.radToDeg) * this.speed;
		this.speed_y = Math.sin(this.angle * Math.radToDeg) * this.speed;
	}


	Bullet.prototype.tick = function() {

		this.distance += this.speed;
		if(this.distance < this.range){
			this.x += this.speed_x;
			this.y += this.speed_y;
		}else{
			this.isDie = true;
		}
	}

// remplace par anim sprite
	Bullet.prototype.explode = function(){
		this.isDie = true;
		var myTween = createjs.Tween.get(this)
							.to({scaleX:3,scaleY:3},200)
							.call(this.setSpeed,[0],this)
							.to({alpha:0},200)
							.call(function(){this.isDie = true;});
	}

window.Bullet = Bullet;

})(window);

