var PlayerShot = function(game,parent,img,width,height,damage,direction)
{
	Shot.call(this,game,parent,img,width,height,damage);

	this.speed = 1000;
	this.direction = direction;
	this.gradient = null;
}
PlayerShot.prototype = new Shot();

PlayerShot.prototype.Update = function(deltaTime)
{
	if(this.isUsed)
	{	
		var pool = this.game.poolManager;
		
		for ( var e in pool.LittleEnnemies)
		{
			if(pool.LittleEnnemies[e].isUsed)
			{
				var distance = MathUtils.SquarredDistance(pool.LittleEnnemies[e].x, this.x, pool.LittleEnnemies[e].y, this.y);
				
				if(distance <= this.radiusSquarred + pool.LittleEnnemies[e].radiusSquarred)
				{
					pool.LittleEnnemies[e].Attacked(this.damage);
					this.isUsed = false;							
				}
			}
		}
		
		this.x += this.direction[0] * this.speed * deltaTime;
		this.y += this.direction[1] * this.speed * deltaTime;

		if(this.y <= 0 )
			this.isUsed = false;
	}	
}

PlayerShot.prototype.Draw = function(graphics,deltaTime)
{
	graphics.save();
	graphics.Check();
	graphics.translate(this.x+this.offsetX,this.y+this.offsetY);
	
	graphics.drawImage(this.gradient,0,0);
	
	Shot.prototype.Draw.call(this, graphics,deltaTime);
	
	graphics.restore();
}

// laser
function testLaser(){
	var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.rect(0, 0, canvas.width, canvas.height);
      //context.rotate(Math.PI/2);

    // Corps laser
      var laser = document.createElement('canvas');
      laser.width = 100;
      laser.height = 1;
      var laserContext = laser.getContext('2d');
    laserContext.rect(0, 0, laser.width, laser.height);
    // create radial gradient
    var grd = laserContext.createLinearGradient(0, 0, 100, 0);
    // light blue
    grd.addColorStop(0.0, 'rgba(50,50,255,0)');
    // dark blue
    grd.addColorStop(0.5, 'rgba(255,255,255,1)');
    grd.addColorStop(01, 'rgba(50,50,255,0)');

    laserContext.fillStyle = grd;
	laserContext.fill();
	
	// Dessin du laser (hauteur variable)
      context.drawImage(laser, 0, 50, 100, 200);
      
      
      // Tête laser
      context.translate(50, 50);
      var hue = 200;
	radiusDraw=50;
      decal = 0.15;
    // create radial gradient
    grad = context.createRadialGradient(0,
       0,
   Math.round( radiusDraw*0.05), 0, 0, 
            Math.round(radiusDraw));
    // light blue
//    this.grad.addColorStop(0, 'rgba(0,0,200,0)');
//    // dark blue
//    this.grad.addColorStop(0.9, 'rgba(150,150,255,0.9)');
//    this.grad.addColorStop(1, 'rgba(200,200,255,1)');
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    // dark blue
    grad.addColorStop(1, 'rgba(50,50,255,0)');

    context.fillStyle = grad;
    
    context.beginPath();
    context.arc(0, 0,
                Math.round(radiusDraw),0,Math.PI, true);
    context.closePath();
    context.fill();
}