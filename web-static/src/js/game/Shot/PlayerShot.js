var PlayerShot = function(game,img,width,height,damage,direction)
{
	Shot.call(this,game,img,width,height,damage);

	this.direction = direction;	
	
	this.gradient = document.createElement('canvas');
	this.gradient.style.background = 'transparent';
	this.gradient.width = width;
	this.gradient.height = height;	
	this.gradContext = this.gradient.getContext("2d");
	
	this.gradContext.translate(this.gradient.width/2,0);

	this.grad = this.gradContext.createRadialGradient(0,  0 , this.radius*0.1, -this.radius * direction[0], this.gradient.height - this.radius * direction[1], this.radius);

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

	this.gradContext.fillCircle(0,0,this.radius);
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