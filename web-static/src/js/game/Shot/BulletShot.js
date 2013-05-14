var BulletShot = function(game,img,width,height,damage,direction)
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

BulletShot.prototype = new Shot();

BulletShot.prototype.Update = function(deltaTime)
{
	this.x += this.direction[0]*deltaTime * 1000;
	this.y += this.direction[1]*deltaTime * 1000;
}


BulletShot.prototype.Die = function()
{
	Shot.prototype.Die.call(this);
}