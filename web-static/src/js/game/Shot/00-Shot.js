var Shot = function(game,img,width,height)
{
	GameObject.call(this,game,img,width,height);	
}

Shot.prototype = new GameObject();

Shot.prototype.Draw = function(graphics,deltaTime)
{
	graphics.save();
	GameObject.prototype.Draw.call(this,graphics, deltaTime);
	graphics.restore();
	
}