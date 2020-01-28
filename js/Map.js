(function(window){


  /**
  * PROPERTIES
  *
  *
  */
 
 // Static
  Map.TILE_WIDTH = 60;
  Map.TILE_HEIGHT = 30;
  Map.ISO_WIDTH = 30;
  Map.ISO_HEIGHT = 15;
  

  // Public 
  Map.prototype.ctx;
  Map.prototype.map;
  Map.prototype.url;
  // position à atteindre ( devrait être calculé à partir de la map)
  Map.prototype.waypoint_x = new Array(0, 6, 6, 11, 11, 8, 8, 11, 11, 18);
  Map.prototype.waypoint_y = new Array(5, 5, 2, 2, 7, 7, 9, 9, 10, 10);

  // Private 
  var _xml;
 
 this._width = 0;
 this._height = 0;

 this.readyToDraw = false;
// Create the loader and queue our 3 images. Images will not 
// begin downloading until we tell the loader to start. 
var loader = new PxLoader(),
    isoTile = loader.addImage('images/isoTile.png'),
    pathH = loader.addImage('images/pathHiso.png'),
    pathV = loader.addImage('images/pathViso.png'),
    pathRD = loader.addImage('images/pathRDiso.png'),
    pathLD = loader.addImage('images/pathLDiso.png'),
    pathRU = loader.addImage('images/pathRUiso.png'),
    pathLU = loader.addImage('images/pathLUiso.png');  

 var ground = new Array();
  ground[0] = loader.addImage('images/groundiso.png');
  ground[1] = loader.addImage('images/groundiso.png');
  ground[2] = loader.addImage('images/groundiso.png');



function Map(url) {
  this.url = url;
  
}
  /**
   * METHODS
   *
   *
   */

  // Public
  Map.prototype.init = function() {
    this.loadMap();
  }

  Map.prototype.getMap = function(){
    return this.map;
  }

  // Private
  Map.prototype.loadMap = function() {
      $.ajax({
          type: "GET",
          url: this.url,
          dataType: "xml",
          success: this.xmlLoaded,
          context: this
      });
  }

Map.prototype.xmlLoaded = function(xml){
    _xml = xml;
    var that = this;
    // begin downloading images 
    loader.addCompletionListener(function() { that.parseXmlMap(_xml) }); 
    loader.start(); 
};



  Map.prototype.parseXmlMap = function(xml) {
        this._width = parseFloat($(xml).find('Level').attr('width'));
        this._height = parseFloat($(xml).find('Level').attr('height'));

        this.map = new Array(this._width);

        for (var x = 0; x < this.map.length; x++) {
            this.map[x] = new Array(this._height)
        }

        var y = 0;
        var mapRef = this.map;
        var mapWidth = this._width;

        $(xml).find("Row").each(function () {
            var row = $(this).text();
            for (var x = 0; x < mapWidth; x++) {
                    
                    switch (row[x]) {
                        case "0":
                            mapRef[x][y] = new Wall(ground);
                            break;
                        case "|":
                            mapRef[x][y] = new Path(pathV);
                            break;
                        case "-":
                            mapRef[x][y] = new Path(pathH);
                            break;
                        case "/":
                            mapRef[x][y] = new Path(pathRD);
                            break;
                        case "\\":
                            mapRef[x][y] = new Path(pathLD);
                            break;
                        case "(":
                            mapRef[x][y] = new Path(pathRU);
                            break;
                        case ")":
                            mapRef[x][y] = new Path(pathLU);
                            break;
                    }
            }
            y++;
        });
        //
        //
        
        this.readyToDraw = true;
        this.draw();


    }

  




 Map.prototype.draw = function(context){
        ctx = (context)?context:ctx;
        console.log("ctx :"+ctx);
        if(!this.readyToDraw){
            return;
        }
        var xCanvasPos = 0;
        var yCanvasPos = 0;

        for (var y = 0; y < this._height; y++) {
            xCanvasPos = Map.TILE_WIDTH/2*y;
            yCanvasPos = Map.TILE_HEIGHT/2*y + 300;
            for (var x = 0; x < this._width; x++) {

                var img = this.map[x][y].GetImage();
                ctx.drawImage(img, xCanvasPos, yCanvasPos);

                xCanvasPos += Map.ISO_WIDTH;
                yCanvasPos -= Map.ISO_HEIGHT;
            }
            
        }

  }

  Map.prototype.isBuildable = function(pX,pY){
      var tX = (pX )/30-1;
      var tY = (-300 + pY -Map.ISO_HEIGHT)/15;
      var fX = (tX-tY)/2;
      var fY = (tY+tX)/2;
      var tile = this.map[fX][fY];
        
       //tX =  pX*2/Map.TILE_WIDTH;
       //tY =  pY*2/Map.TILE_HEIGHT - 180;

       return(tile instanceof Wall);
    }



function Wall(ground) {
  this.GetImage = function() {
    //this.wall = new Image();
    var r = Math.round(Math.random()*5);
    var n = (r>2)?0:r;
    return ground[n];
  }
}

function Path(pic) {
  this.pic = pic;
  this.GetImage = function() {
    return this.pic;
  }
}

window.Map = Map;

})(window);