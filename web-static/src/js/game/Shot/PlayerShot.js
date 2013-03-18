var PlayerShot = function(game,img,width,height,direction)
{
	Shot.call(this,game,img,width,height);
}
PlayerShot.prototype = new Shot();

PlayerShot.prototype.Update = function(deltaTime)
{
	this.y -= 500 * deltaTime;
}

PlayerShot.prototype.Draw = function(graphics,deltaTime)
{
	Shot.prototype.Draw.call(this,graphics,deltaTime);
}