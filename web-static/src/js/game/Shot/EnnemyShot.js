var EnnemyShot = function(game,img,width,height,damage)
{
	Shot.call(this,game,img,width,height,damage);
	
	this.gradient = document.createElement('canvas');
	this.gradient.style.background = 'transparent';
	this.gradient.width = width;
	this.gradient.height = height;
	this.gradContext = this.gradient.getContext("2d");
	
	this.gradContext.translate(width/2,height/2);
	
	this.grad = this.gradContext.createRadialGradient(0, 0, 0, 0, 0, this.radius);

/*
	this.grad.addColorStop(0.4, 'rgba(0,76,179,0.8)');
	this.grad.addColorStop(1, 'rgba(140,208,255,0.9)');
	//*/
	//*
	this.grad.addColorStop(0, 'rgba(102,0,0,1)');
	this.grad.addColorStop(0.2, 'rgba(150,0,0,0.9)');
	this.grad.addColorStop(0.4, 'rgba(200,0,0,0.8)');
	this.grad.addColorStop(0.6, 'rgba(255,0,0,0.7)');
	this.grad.addColorStop(1, 'rgba(255,0,0,0.5)');
//*/
	/*
	this.grad.addColorStop(0.4, 'rgba(0,76,179,0.8)');
	this.grad.addColorStop(1, 'rgba(140,208,255,0.9)');
	//*/
	this.gradContext.fillStyle = this.grad;
	this.gradContext.fillCircle = function(x, y, radius)
	{
		this.beginPath();
		this.arc(x,y,radius,0,2*Math.PI);
		this.closePath();
		this.fill();
	};

	this.gradContext.fillCircle(0,0,this.radius);
		
	this.direction = new Array();
}
EnnemyShot.prototype = new Shot();

EnnemyShot.prototype.Update = function(deltaTime)
{
	this.x += this.direction[0]*deltaTime * 500;
	this.y += this.direction[1]*deltaTime * 500;
	Shot.prototype.Update.call(this,deltaTime);
	
	if(this.x > this.game.canvas.width || this.x < 0+ this.offsetX*2 || this.y < 0+ this.offsetY*2 || this.y > this.game.canvas.height)
	{
		this.isUsed = false;
	}
}

EnnemyShot.prototype.Draw = function(graphics,deltaTime)
{
	graphics.save();
	graphics.Check();
	graphics.translate(this.x+this.offsetX,this.y+this.offsetY);

	graphics.drawImage(this.gradient,0,0);
	
	graphics.restore();
}