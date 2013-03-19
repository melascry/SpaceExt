var EnnemyShot = function(game,img,width,height,damage)
{
	Shot.call(this,game,img,width,height,damage);
	
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
	Shot.prototype.Draw.call(this,graphics,deltaTime);
}