var PlayerShot = function(game,img,width,height,damage,direction)
{
	Shot.call(this,game,img,width,height,damage);

	this.direction = direction;	
	
	this.gradient = document.createElement('canvas');
	this.gradient.style.background = 'transparent';
	this.gradient.width = width;
	this.gradient.height = height;	
	this.gradContext = this.gradient.getContext("2d");

	var decal = 0.15;
	var radiusDraw = this.radius*0.9;
	this.gradContext.translate(this.gradient.width/2,this.gradient.width/2);
	this.gradContext.rotate( Math.atan2(direction[1],direction[0]) + Math.PI / 2);
	this.gradContext.translate(0,Math.round(radiusDraw*decal));

	/*this.grad = this.gradContext.createRadialGradient(0,  0 , this.radius*0.1, -this.radius * direction[0], this.gradient.height - this.radius * direction[1], this.radius);
	
	this.grad.addColorStop(0, 'rgba(255,0,0,1)');
	this.grad.addColorStop(1, 'rgba(255,0,0,1)');

	this.gradContext.fillStyle = this.grad;
	this.gradContext.fillCircle = function(x, y, radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.fill();
	};
	 */
	//this.gradContext.fillCircle(0,0,this.radius);
	/*
	this.gradContext.beginPath();
	this.gradContext.lineTo(-5,5);
	this.gradContext.lineTo(5,5);
	this.gradContext.lineTo(0,0);
	this.gradContext.closePath();
	this.gradContext.fill();
	*/

	var hue = 70;
	
    // create radial gradient
    this.grad = this.gradContext.createRadialGradient(0,Math.round( radiusDraw*decal),Math.round( radiusDraw*(1-decal)), 0, 0, Math.round(radiusDraw));
    // light blue
//    this.grad.addColorStop(0, 'rgba(0,0,200,0)');
//    // dark blue
//    this.grad.addColorStop(0.9, 'rgba(150,150,255,0.9)');
//    this.grad.addColorStop(1, 'rgba(200,200,255,1)');
    this.grad.addColorStop(0, 'hsla('+hue+',100%,30%,0)');
    // dark blue
    this.grad.addColorStop(0.8, 'hsla('+hue+',100%,40%,0.9)');
    this.grad.addColorStop(1, 'hsla('+hue+',100%,75%,1)');

    this.gradContext.fillStyle = this.grad;
    
    this.gradContext.beginPath();
    this.gradContext.arc(0, Math.round(-radiusDraw*decal),Math.round(radiusDraw),0,2*Math.PI);
    this.gradContext.closePath();
    this.gradContext.fill();
	
}
PlayerShot.prototype = new Shot();

PlayerShot.prototype.Update = function(deltaTime)
{

	this.x += this.direction[0] * 1000 * deltaTime;
	this.y += this.direction[1] * 1000 * deltaTime;
	
	if(this.y <= 0 )
		this.isUsed = false;
}

PlayerShot.prototype.Draw = function(graphics,deltaTime)
{
	//Shot.prototype.Draw.call(this,graphics,deltaTime);
	graphics.save();
	graphics.Check();
	graphics.translate(this.x+this.offsetX,this.y+this.offsetY);
	
	graphics.drawImage(this.gradient,0,0);
	
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