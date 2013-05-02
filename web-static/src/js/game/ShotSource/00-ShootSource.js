var ShootSource = function(game,img,width,height,direction,damage)
{
	GameObject.call(this,game,img,width,height);

	this.shootDirection = direction
	this.damage = damage;
}

ShootSource.prototype = new GameObject();

ShootSource.prototype.Draw(graphics, deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
}

ShootSource.prototpe.Shoot()
{
	
}