(function(window){

//
function Tower() {
  this.initialize();
}
Tower.prototype = new createjs.Container();


// Public properties:

  Tower.prototype.range = 120;
  Tower.prototype.bound = 120;
  Tower.prototype.shootTime = 0;
  Tower.prototype.frequency = 10;
  Tower.prototype.damage = 1;
  Tower.prototype.text = null;
  Tower.prototype.bitmap = null;
  Tower.prototype.range_circle = null;
  Tower.prototype.cost = 20;


// Constructor:
  Tower.prototype.Container_initialize = Tower.prototype.initialize;

  Tower.prototype.initialize = function(){
    this.Container_initialize();
    
    this.bitmap = new createjs.Bitmap("images/tower.png");
    this.bitmap.regX = 15;
    this.bitmap.regY = 15;

    this.range_circle = new createjs.Shape();
    var g = this.range_circle.graphics;
    g.setStrokeStyle(1);
    g.beginStroke(createjs.Graphics.getRGB(0,0,0,0.4));
    g.beginFill(createjs.Graphics.getRGB(255,0,0,0.1));
    g.drawCircle(this.regX,this.regY,this.range);

    this.range_circle.mouseEnabled = false;

    // var c = new Shape();
    // var g = c.graphics;
    // g.beginFill(Graphics.getRGB(255,255,0));
    // g.drawCircle(0,0,2); 

    this.addChild(this.range_circle,this.bitmap);
  }

  // Tower.prototype.onMouseOver = function(e){
  //   this.displayRange(true);
  // }
  // Tower.prototype.onMouseOut = function(e){
  //   this.displayRange(false);
  // }
//  Tower.prototype.onMouseMove = function(e){
//    tower.x = Math.floor(e.stageX/30)*30+Map.TILE_SIZE/2;
//    tower.y = Math.floor(e.stageY/30)*30+Map.TILE_SIZE/2;
//  }

//   Tower.prototype.onPress = function () {

//     this.txt = new Text(this.health, "bold 10px Arial", "#f00");
//     this.txt.x = 16;
//     this.txt.y = -5;
//     this.txt.text = this.range+"\n"+this.frequency+"\n"+this.damage;

//     this.addChild(this.txt);
//   }


// public methods:
  Tower.prototype.ghost = function(enable){
    this.bitmap.alpha = enable?0.5:1;
    this.displayRange(enable);
  }

  Tower.prototype.displayRange = function(enable){
        this.range_circle.visible = enable;
  }

  Tower.prototype.tick = function() {
    // tir en cours ?
      this.shootTime++;
      if (this.shootTime > this.frequency){
        this.isShooting = false;
        this.shootTime = 0;
      }
  }

  Tower.prototype.shoot = function(){
   this.isShooting = true;
  }



  window.Tower = Tower;

})(window);