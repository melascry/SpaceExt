var HoriDrone = function(game,img,width,height,left,fireRate)
{
	GameObject.call(this,game,img,width,height);
	
	this.x = left?-100:100;
	this.y = 0;
	
	this.canFire = true;
	this.timerFire = 1/fireRate;
	this.timer = 0;
	this.ammo = 100;
}

HoriDrone.prototype = new GameObject();

HoriDrone.prototype.Update = function(deltaTime)
{
	if(!this.canFire)
	{
		this.timer += deltaTime;
		if(this.timer >= this.timerFire)
		{
			this.timer = 0;
			this.canFire = true;
		}
	}
	GameObject.prototype.Update.call(this,deltaTime);
};

HoriDrone.prototype.Draw = function(graphics,deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
}

HoriDrone.prototype.Fire = function()
{
	if(this.ammo > 0)
	{
		this.canFire = false;
		this.ammo--;
		
		var c = this.game.poolManager.GetDroneShot();
		c.x = this.x + this.game.player.x;
		c.y = this.y + this.game.player.y;
	}
}

HoriDrone.prototype.Die = function()
{
	GameObject.prototype.Die.call(this);
}