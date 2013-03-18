var RadialDrone = function(game,img,width,height,distance,startAngle)
{
	GameObject.call(this,game,img,width,height);
	
	this.distance = distance;
	this.radialSpeed = 3;
	
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
	if(this.alive)
	{
		this.angle += this.radialSpeed*deltaTime;
		
		this.x = Math.cos(this.angle)*this.distance;
		this.y = Math.sin(this.angle)*this.distance;

		GameObject.prototype.Update.call(this,deltaTime);
	}
	else
	{
		this.timerRevive += deltaTime;
		if(this.timerRevive >= this.TimeToRevive)
		{
			this.timerRevive = 0;
			this.alive = true;
		}
	}
}
RadialDrone.prototype.Draw = function(graphics,deltaTime)
{
	if(this.alive)
	{
		GameObject.prototype.Draw.call(this,graphics,deltaTime);
	}
}