var DroneShot = function (game,img,width,height,damage)
{
	Shot.call(this,game,img,width,height,damage);
}

DroneShot.prototype = new Shot();

DroneShot.prototype.Update = function(deltaTime)
{

	this.y -= 1000 * deltaTime;
	
	if(this.y <= 0 )
		this.isUsed = false;
}

DroneShot.prototype.Draw = function(graphics,deltaTime)
{
	Shot.prototype.Draw.call(this,graphics,deltaTime);
}