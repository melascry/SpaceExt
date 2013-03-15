var HoriDrone = function(img,width,height,left)
{
	GameObject.call(this,img,width,height);
	
	this.x = left?-100:100;
	this.y = 0;
	
}

HoriDrone.prototype = new GameObject();

HoriDrone.prototype.Update = function(deltaTime)
{
	GameObject.prototype.Update.call(this,deltaTime);
};

HoriDrone.prototype.Draw = function(graphics,deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
}