var PlayerShot = function(game,img,width,height,damage,direction)
{
	Shot.call(this,game,img,width,height,damage);
	
	this.direction = direction;
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
	Shot.prototype.Draw.call(this,graphics,deltaTime);
}