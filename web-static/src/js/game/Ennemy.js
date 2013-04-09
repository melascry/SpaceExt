var Ennemy = function(game,img,width,height,index)
{
	GameObject.call(this,game,img,width,height);
	
	this.timer = 0;
	
	this.FireTimer = 1;
	
	this.index = index; 
	this.life = 10; 
}

Ennemy.prototype = new GameObject();

Ennemy.prototype.Update = function(deltaTime)
{
	if(this.game.player != null)
	{
		this.timer += deltaTime;
		if(this.timer >= this.FireTimer)
		{
			var c = this.game.poolManager.GetLittleEnnemiesShot();
			c.x = this.x ;
			c.y = this.y ;
			var d = MathUtils.Distance(c.x,this.game.player.x,c.y,this.game.player.y);
	
			c.direction[0] = (this.game.player.x-c.x)/d;
			c.direction[1] = (this.game.player.y-c.y)/d;
			
			this.timer = 0;
		}
	}
	this.y += 50*deltaTime;
	
	GameObject.prototype.Update.call(this,deltaTime);

	if(this.y > this.game.canvas.height)
		this.isUsed = false;
}

Ennemy.prototype.Draw = function(graphics, deltaTime)
{
	GameObject.prototype.Draw.call(this,graphics,deltaTime);
}

Ennemy.prototype.PopInWorld = function()
{
	this.x = Math.random() * 1000;
	this.y = 0;
}

Ennemy.prototype.Attacked = function(damage)
{
	this.life -= damage;
	if(this.life <= 0)
	{
		this.isUsed = false;
		this.life = 10;
	}
}