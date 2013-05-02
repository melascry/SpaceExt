var DroneShot = function (game,parent,img,width,height,damage)
{
	Shot.call(this,game,parent,img,width,height,damage);
}

DroneShot.prototype = new Shot();

DroneShot.prototype.Update = function(deltaTime)
{

	if(this.isUsed)
	{	
		this.y -= 1000 * deltaTime;

		var pool = this.game.poolManager;
		
		for ( var e in pool.LittleEnnemies)
		{
			if(pool.LittleEnnemies[e].isUsed)
			{
				var distance = MathUtils.SquarredDistance(pool.LittleEnnemies[e].x, pool.DroneShoots[i].x, pool.LittleEnnemies[e].y, pool.DroneShoots[i].y);
				
				if(distance <= pool.DroneShoots[i].radiusSquarred + pool.LittleEnnemies[e].radiusSquarred)
				{
					pool.LittleEnnemies[e].isUsed = false;
					pool.DroneShoots[i].isUsed = false;							
				}
			}
		}
	}
	
	if(this.y <= 0 )
		this.isUsed = false;
}

DroneShot.prototype.Draw = function(graphics,deltaTime)
{
	graphics.drawImage(this.img,this.x,this.y);
	Shot.prototype.Draw.call(this,graphics,deltaTime);
}