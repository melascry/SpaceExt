var Shot = function(game,parent,img,width,height,damage)
{
	GameObject.call(this,game,parent,img,width,height);
	
	this.damage = damage;
	this.speed = 500;
}

Shot.prototype = new GameObject();

Shot.prototype.Draw = function(graphics,deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics, deltaTime);	
}