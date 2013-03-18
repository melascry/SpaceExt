var EnnemyShot = function(game,img,width,height)
{
	Shot.call(this,game,img,width,height);
	
	this.direction = new Array();
}
EnnemyShot.prototype = new Shot();

EnnemyShot.prototype.Update = function(deltaTime)
{
	this.x += this.direction[0]*deltaTime * 500;
	this.y += this.direction[1]*deltaTime * 500;
	Shot.prototype.Update.call(this,deltaTime);
}
	
EnnemyShot.prototype.Draw = function(graphics,deltaTime)
{
	Shot.prototype.Draw.call(this,graphics,deltaTime);
}