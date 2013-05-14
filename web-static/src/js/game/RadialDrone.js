var RadialDrone = function(game,parent,img,width,height,distance,startAngle)
{
	GameObject.call(this,game,parent,img,width,height);
	
	this.distance = distance;
	this.radialSpeed = 6;
	
	this.angle = startAngle;
	
	this.x = Math.cos(this.angle);
	this.y = Math.sin(this.angle);
	
	this.alive = true;
	
	this.timerRevive = 0;
	this.TimeToRevive = 5;
}

RadialDrone.prototype = new GameObject();

RadialDrone.prototype.Update = function(deltaTime)
{
	this.angle += this.radialSpeed*deltaTime;
	
	this.x = Math.cos(this.angle)*this.distance;
	this.y = Math.sin(this.angle)*this.distance;
	
	if(!this.alive)
	{
		this.timerRevive += deltaTime;
		if(this.timerRevive >= this.TimeToRevive)
		{
			this.timerRevive = 0;
			this.alive = true;
			this.physical = true;
			this.visible = true;
		}
	}

	GameObject.prototype.Update.call(this,deltaTime);
}
RadialDrone.prototype.Draw = function(graphics,deltaTime)
{
	if(this.alive)
	{
		graphics.save();
		graphics.translate(this.x,this.y);
		
		//graphics.strokeCircle(0,0,this.radius);
		
		graphics.drawImage(this.img,this.offsetX,this.offsetY);
		
		GameObject.prototype.Draw.call(this,graphics,deltaTime);
		
		graphics.restore();
	}
}


RadialDrone.prototype.Die = function()
{
	GameObject.prototype.Die.call(this);
}