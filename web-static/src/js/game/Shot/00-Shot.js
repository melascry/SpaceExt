var Shot = function(game,img,width,height,damage)
{
	GameObject.call(this,game,img,width,height);
	
	this.damage = damage;
}

Shot.prototype = new GameObject();

Shot.prototype.Draw = function(graphics,deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics, deltaTime);	
}